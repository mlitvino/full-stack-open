import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { SignInContainer } from './SignIn';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      const onSubmit = jest.fn();

      const { getByPlaceholderText, getByText } = await render(
        <SignInContainer onSubmit={onSubmit} />,
      );

      await fireEvent.changeText(getByPlaceholderText('Username'), 'kalle');
      await fireEvent.changeText(getByPlaceholderText('Password'), 'password');
      await fireEvent.press(getByText('Sign in'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'kalle',
          password: 'password',
        });
      });
    });
  });
});
