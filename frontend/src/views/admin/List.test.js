import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';
import List from './List';
import { LogService } from '../../services/api.service';


// Mocking the LogService module 
jest.mock('../../services/api.service.js', () => ({
    LogService: {
        getList: jest.fn(() => Promise.resolve({ data: [] })),
        editStatus: jest.fn(() => Promise.resolve()),
    },
}));

describe('List component', () => {
    beforeEach(() => {
        render(<List />)
    })

    it('should render List component with heading text correctly', () => {

        const HeaderText = screen.getByText('Logs List')
        expect(HeaderText).toBeInTheDocument();
    });

    it('should render loader when list data are loading', () => {

        const loaderStatus = screen.queryByTestId('loader')

        expect(loaderStatus).toBeInTheDocument()
    })

    it('should render List component with mock data', async () => {
        // Mock data for the test
        const mockData = [
            {
                id: 1,
                task: { taskName: 'Task 1' },
                date: '2023-01-01',
                startTime: "2023-02-21T06:30:00.000Z",
                endTime: '2023-02-21T08:30:00.000Z',
                comment: 'Test Comment',
                duration: '2 hours',
                status: 'pending',
            },
        ];

        // Mock the getList function to return the mockData
        LogService.getList.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <List />
            );
        });

        const taskTitle = screen.getByText('Task 1')
        const dateInstance = screen.getByText(moment('2023-01-01').format('MM/DD/YYYY'))
        const startTime = screen.getByText(moment('2023-02-21T06:30:00.000Z').format("HH:mm:ss"))
        const endTime = screen.getByText(moment('2023-02-21T08:30:00.000Z').format("HH:mm:ss"))
        const comment = screen.getByText('Test Comment')
        const status = screen.getByText('pending')

        expect(taskTitle).toBeInTheDocument();
        expect(dateInstance).toBeInTheDocument();
        expect(startTime).toBeInTheDocument();
        expect(endTime).toBeInTheDocument();
        expect(comment).toBeInTheDocument();
        expect(status).toBeInTheDocument();

    });

    test('handle approve action correctly', async () => {
        // Mock data for the test
        const mockData = [
            {
                id: 1,
                task: { taskName: 'Task 1' },
                date: '2023-01-01',
                startTime: "2023-02-21T06:30:00.000Z",
                endTime: '2023-02-21T08:30:00.000Z',
                comment: 'Test Comment',
                duration: '2 hours',
                status: 'pending',
            },
        ];

        // Mock the getList function to return the mockData
        LogService.getList.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <List />
            );
        });

        const taskTitle = screen.getByText('Task 1')

        expect(taskTitle).toBeInTheDocument()

        const checkButton = screen.getByTestId('check')
        expect(checkButton).toBeInTheDocument()

        // Find and click the Approve button
        fireEvent.click(checkButton);

        // Mock the editStatus function to simulate approval
        LogService.editStatus.mockResolvedValueOnce(1, 'approved');

        await act(async () => {
            render(
                <List />
            );
        });

        const status = screen.getByText('approved')

        // Assert that the status is updated to 'approved'
        expect(status).toBeInTheDocument();
    });
});
