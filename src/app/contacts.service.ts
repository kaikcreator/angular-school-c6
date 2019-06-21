import { Injectable } from '@angular/core';
import { Contact, PhoneType} from './contact.model';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContactsService {
    constructor(private http:HttpClient) { 
    }

    getContacts(){
        return this.http.get<Contact[]>('http://localhost:3000/contacts');
    }

    getContactById(id){
        return this.http.get<Contact>(`http://localhost:3000/contacts/${id}`);
    }

    public addContact(contact:Contact){
        return this.http.post('http://localhost:3000/contacts', contact).pipe(
            mergeMap( (res:Contact) => this.updateContactImage(res, contact.pictureFile) )
        );
    }

    public updateContact(contact:Contact){
        return this.http.patch(`http://localhost:3000/contacts/${contact.id}`, contact).pipe( mergeMap( (res:Contact) => this.updateContactImage(res, contact.pictureFile) ));
    }

    private updateContactImage(contact:Contact, file:File){
        if(!file){
            return of(contact);
        }
        let formData = new FormData();
        formData.append('picture', file, file.name);
        return this.http.patch(`http://localhost:3000/contacts/${contact.id}`, formData);
    }

    public removeContact(contact:Contact){
        return this.http.delete(`http://localhost:3000/contacts/${contact.id}`);
    }

}