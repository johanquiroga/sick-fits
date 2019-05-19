import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';

import { fakeUser } from '../lib/testUtils';

import { CURRENT_USER_QUERY } from '../components/User';

import Signup, { SIGNUP_MUTATION } from '../components/Signup';

function type(wrapper, name, value, type = 'text') {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate('change', { target: { name, value, type } });
}

const me = fakeUser();

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: { name: me.name, email: me.email, password: 'password' },
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
];

describe('<Signup />', () => {
  it('should render and match snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('should call the mutation properly', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    type(wrapper, 'name', me.name);
    type(wrapper, 'email', me.email);
    type(wrapper, 'password', 'password');
    wrapper.update();
    wrapper.find('form').simulate('submit');
    await wait();
    // query the user out of the apollo client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
