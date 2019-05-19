import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';

import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'johan.c.quiroga@gmail.com' },
    },
    result: {
      data: { requestReset: { message: 'success', __typename: 'Message' } },
    },
  },
];

describe('<RequestReset />', () => {
  it('should render and match snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('should call the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate typing an email
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'johan.c.quiroga@gmail.com' },
    });
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find('p').text()).toContain(
      'Success! Check your email for a reset link!'
    );
  });
});
