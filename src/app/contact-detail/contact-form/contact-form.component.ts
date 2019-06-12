import { Component, OnInit } from '@angular/core';
import { Contact, PhoneType } from 'src/app/contact.model';
import { ContactsService } from 'src/app/contacts.service';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { startsWithCapitalValidator } from 'src/app/directives/startsWithCapital.directive';
import { tap, filter, map } from 'rxjs/operators';
import { zip } from 'rxjs';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  
  public readonly phoneTypes:string[] = Object.values(PhoneType);

  public contactForm:FormGroup = new FormGroup({
    name: new FormControl('', [ Validators.required, Validators.minLength(2), startsWithCapitalValidator() ]),
    picture: new FormControl('assets/default-user.png'),
    phones: new FormArray([ 
      new FormGroup({
        type: new FormControl(null),
        number: new FormControl('')
      })
    ]),
    email: new FormControl(''),
    address: new FormControl('')
  });

  constructor(private contactsService:ContactsService) { }

  ngOnInit() {
    const contact = localStorage.getItem('contact');
    if(contact){
      const contactJSON = JSON.parse(contact);
      this.phones.clear();
      for(let i=0; i< contactJSON.phones.length; i++){
        this.addNewPhoneToModel();
      }
      this.contactForm.setValue(contactJSON);
    }
    
    zip(this.contactForm.statusChanges, this.contactForm.valueChanges).pipe(
      filter( ([state, value]) => state == 'VALID' ),
      map(([state, value]) => value),
      tap(data => console.log(data)),
    ).subscribe(formValue => {
      localStorage.setItem('contact', JSON.stringify(formValue));
    });
  }

  addContact(){
    this.contactsService.addContact(this.contactForm.value);
    this.phones.clear();
    this.addNewPhoneToModel();
    this.contactForm.reset({
      picture:'assets/default-user.png',
    });
    localStorage.removeItem('contact');
  }

  addNewPhoneToModel(){
    this.phones.push(
      new FormGroup({
        type: new FormControl(null),
        number: new FormControl('')
      })
    );
  }

  addImage(event){
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt) => {
      this.contactForm.patchValue({
        picture:reader.result
      });
    }
  }

  get name(){
    return this.contactForm.get('name');
  }

  get phones(){
    return this.contactForm.get('phones') as FormArray;
  }

}
