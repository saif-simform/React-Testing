import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import { store } from '../../store';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { AuthService } from '../../services/api.service';
import { Provider } from 'react-redux';

// Mocking the AuthService module 
jest.mock('../../services/api.service.js', () => ({
    AuthService: {
        login: jest.fn().mockResolvedValueOnce({
            user: { isSuperUser: true },
            token: 'mockToken',
        }),
    },
}));

// Mock the toast.success function
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    },
}));

describe('Login component', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Router>
                    <Login />
                </Router>
            </Provider>

        )
    })

    it('should render Login component with title and heading text correctly', async () => {
        const titleText = screen.queryByTestId('login-text')
        const HeadingText = screen.queryByTestId('heading-text')

        expect(titleText).toBeInTheDocument();
        expect(HeadingText).toBeInTheDocument();
    });

    it('should handle login successfully', async () => {

        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const loginButton = screen.getByRole('button', { name: 'Login' })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.submit(loginButton);

        // Wait for the asynchronous login operation to complete
        await waitFor(() => {
            expect(AuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });

            // display toast success message
            expect(toast.success).toHaveBeenCalledWith('Login Successfully');
        });
    })
})