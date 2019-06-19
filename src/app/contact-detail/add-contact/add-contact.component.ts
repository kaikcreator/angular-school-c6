import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactsService } from 'src/app/contacts.service';
import { Contact } from 'src/app/contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-add-contact',
  template: `<app-contact-form 
                [contact]="contact" 
                (valueChanges)="saveInLocalStorage($event)"
                (submitContact)="addContact($event)">
                Add contact
              </app-contact-form>`
})
export class AddContactComponent implements OnInit {
  
  public contact: Contact;
  
  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    const contact = localStorage.getItem('contact');
    if (contact) {
      this.contact = JSON.parse(contact);
    }
  }

  saveInLocalStorage(contact) {
    localStorage.setItem('contact', JSON.stringify(contact));
  }

  addContact(contact) {
    this.contactsService.addContact(contact);
    localStorage.removeItem('contact');
  }

}
