import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $image: String
    $largeImage: String
    $price: Int
  ) {
    updateItem(
      data: {
        id: $id
        title: $title
        description: $description
        image: $image
        largeImage: $largeImage
        price: $price
      }
    ) {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;

/* eslint-disable react/display-name,react/prop-types */
const Composed = adopt({
  singleItem: ({ singleItemVariables, render }) => (
    <Query query={SINGLE_ITEM_QUERY} variables={singleItemVariables}>
      {render}
    </Query>
  ),
  updateItem: ({ render }) => (
    <Mutation mutation={UPDATE_ITEM_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
});
/* eslint-enable react/display-name,react/prop-types */

class UpdateItem extends Component {
  state = {
    data: {},
    uploadLoading: false,
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value || 0) : value;
    this.setState(prevState => ({ data: { ...prevState.data, [name]: val } }));
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: { id: this.props.id, ...this.state.data },
    });
  };

  // {({ data: singleItem.data, loading: dbLoading }) => {
  render() {
    const { uploadLoading } = this.state;
    return (
      <Composed singleItemVariables={{ id: this.props.id }}>
        {({
          singleItem,
          updateItem: { mutation: updateItem, result: updateResult },
        }) => {
          if (singleItem.loading) return <p>Loading...</p>;
          if (!singleItem.data.item)
            return <p>No Item Found for ID {this.props.id}</p>;
          return (
            <Form onSubmit={e => this.updateItem(e, updateItem)}>
              <ErrorMessage error={updateResult.error} />
              <fieldset
                disabled={uploadLoading || updateResult.loading}
                aria-busy={uploadLoading || updateResult.loading}
              >
                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    required
                    defaultValue={singleItem.data.item.title}
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
                    defaultValue={singleItem.data.item.price}
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
                    defaultValue={singleItem.data.item.description}
                    onChange={this.handleChange}
                  />
                </label>
                <button type="submit">
                  Sav{updateResult.loading ? 'ing' : 'e'} Changes
                </button>
              </fieldset>
            </Form>
          );
        }}
      </Composed>
    );
  }
}
export default UpdateItem;
export { UPDATE_ITEM_MUTATION, SINGLE_ITEM_QUERY };
