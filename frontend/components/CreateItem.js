import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      data: {
        title: $title
        description: $description
        image: $image
        largeImage: $largeImage
        price: $price
      }
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    data: {
      title: '',
      description: '',
      image: '',
      largeImage: '',
      price: 0,
    },
    uploadLoading: false,
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value || 0) : value;
    this.setState(prevState => ({ data: { ...prevState.data, [name]: val } }));
  };

  uploadFile = async e => {
    const { files } = e.target;
    if (files.length) {
      const data = new FormData();
      data.append('file', files[0]);
      data.append('upload_preset', 'sick-fits');

      this.setState({ uploadLoading: true });

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/johanquiroga/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );

      const file = await res.json();
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          image: file.secure_url,
          largeImage: file.eager[0].secure_url,
        },
        uploadLoading: false,
      }));
    } else {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          image: '',
          largeImage: '',
        },
      }));
    }
  };

  render() {
    const { data, uploadLoading } = this.state;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={data}>
        {(createItem, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createItem();
              // change them to the single item page
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id },
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset
              disabled={uploadLoading || loading}
              aria-busy={uploadLoading || loading}
            >
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {data.image && (
                  <img width="200" src={data.image} alt="Upload preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={data.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={data.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  required
                  value={data.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default CreateItem;
export { CREATE_ITEM_MUTATION };
