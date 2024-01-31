import React, { Component } from 'react';
import { nanoid } from 'nanoid';

import Section from './section/Section';
import Phonebook from './phonebook/Phonebook';
import Contacts from './contacts/Contacts';

const CONTACTS_KEY = 'contacts';

class ContactBook extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const data = localStorage.getItem(CONTACTS_KEY);

    try {
      data && this.setState({ contacts: JSON.parse(data) });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.contacts.length !== this.state.contacts.length) {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  render() {
    return (
      <>
        <Section title="This is my Contact Book">
          <Phonebook handleSubmit={this.handleSubmit} />
          <Contacts
            handleInputChange={this.handleInputChange}
            handleDelete={this.handleContactDelete}
            contacts={this.state.contacts}
            filter={this.state.filter}
          />
        </Section>
      </>
    );
  }

  handleSubmit = event => {
    event.preventDefault();

    const form = event.target;
    const name = form.elements.name.value.trim();
    const number = form.elements.number.value.trim();

    const checkExistence = this.state.contacts.find(
      item => item.name.toUpperCase() === name.toUpperCase()
    );

    checkExistence
      ? alert(`"${name}" is already in contacts`)
      : this.setState(prev => {
          const newContact = { id: nanoid(), name, number };
          return { contacts: [...prev.contacts, newContact] };
        });

    form.reset();
  };

  handleInputChange = event => {
    this.setState({ filter: event.target.value.trim() });
  };

  handleContactDelete = ({ target }) => {
    this.setState(prev => {
      return { contacts: prev.contacts.filter(item => item.id !== target.id) };
    });
  };
}

export default ContactBook;
