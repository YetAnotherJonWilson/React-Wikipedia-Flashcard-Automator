import React from 'react';
import renderer from 'react-test-renderer';
import SearchButton from '../SearchButton';

test('Search renders correctly', () => {
  const component = renderer.create(<Search />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
