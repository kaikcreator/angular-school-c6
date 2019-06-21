import { Injectable } from '@angular/core';
import { Contact, PhoneType} from './contact.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ContactsService {
    private contactsSubject = new BehaviorSubject<Contact[]>([]);

    constructor(private http:HttpClient) { 
    }

    getContacts(){
        return this.http.get<Contact[]>('http://localhost:3000/contacts');
    }

    getContactById(id){
        return this.http.get<Contact>(`http://localhost:3000/contacts/${id}`);
    }

    public addContact(contact:Contact){
        if(!contact.picture)
            contact.picture = "assets/default-user.png";
        if(!contact.id)
            contact.id = this.contactsSubject.value.length + 1;            
        this.contactsSubject.next([...this.contactsSubject.value, contact ]);
    }

    public updateContact(contact:Contact){
        const contacts = this.contactsSubject.value;
        let replaceIndex = contacts.findIndex( item => item.id == contact.id);
        const newContacts = [
            ...contacts.slice(0,replaceIndex), 
            contact, 
            ...contacts.slice(replaceIndex+1)
        ];
        this.contactsSubject.next(newContacts);
    }

    public removeContact(contact:Contact){
        const contacts = this.contactsSubject.value;
        let replaceIndex = contacts.findIndex( item => item.id == contact.id);
        const newContacts = [
            ...contacts.slice(0,replaceIndex), 
            ...contacts.slice(replaceIndex+1)
        ];
        this.contactsSubject.next(newContacts);                
    }

}