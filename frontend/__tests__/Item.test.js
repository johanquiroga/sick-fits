import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Item from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.js',
};

describe('<Item />', () => {
  // it('should render the price tag and title properly', () => {
  //   const wrapper = shallow(<Item item={fakeItem} />);
  //   const PriceTag = wrapper.find('PriceTag');
  //   expect(PriceTag.children().text()).toBe('$50');
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  // });

  // it('should render the image properly', () => {
  //   const wrapper = shallow(<Item item={fakeItem} />);
  //   const img = wrapper.find('img');
  //   expect(img.props().src).toBe(fakeItem.image);
  //   expect(img.props().alt).toBe(fakeItem.title);
  // });

  // it('should render out the button properly', () => {
  //   const wrapper = shallow(<Item item={fakeItem} />);
  //   const buttonList = wrapper.find('.buttonList');
  //   expect(buttonList.children()).toHaveLength(3);
  //   expect(buttonList.find('Link').exists()).toBe(true);
  //   expect(buttonList.find('AddToCart').exists()).toBe(true);
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true);
  // });
  it('should render and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
