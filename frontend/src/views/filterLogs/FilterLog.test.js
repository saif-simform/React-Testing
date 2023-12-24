import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import List from './List';
import { LogService } from '../../services/api.service.js';
import userEvent from '@testing-library/user-event';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigator
}));

jest.mock('../../services/api.service.js', () => ({
    LogService: {
        getFilterList: jest.fn(() => Promise.resolve({ data: [] })),
    }

}));

describe('FilterLog List component', () => {
    it('should render FilterLog List component with heading text correctly', () => {

        render(<List />)

        const HeaderText = screen.getByText('Logs List')
        expect(HeaderText).toBeInTheDocument();
    });

    it('should render the component and apply filters', async () => {

        const mockData = {
            rangeData: [
                {
                    "duration": 8,
                    "date": "Sunday, February 5, 2023 12:00 AM - Saturday, February 11, 2023 12:00 AM"
                },
            ],
            logData: [
                {
                    "startTime": "2023-02-21T06:30:00.000Z",
                    "endTime": "2023-02-21T09:30:00.000Z",
                    "duration": 3,
                    "comment": "Hello",
                    "status": "approved",
                    "task": {
                        "taskName": "Task-1",
                        "id": "1"
                    },
                    "id": "63f359cf44a629571a52d543"
                },]
        }

        LogService.getFilterList.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <List />
            );
        });

        // Mock user interaction
        const startDate = screen.getByPlaceholderText('Select start date')
        const endDate = screen.getByPlaceholderText('Select end date')
        const label = screen.queryByTestId('exampleSelect')
        const filterButton = screen.getByRole('button', { name: 'Apply Filter' })

        fireEvent.change(startDate, { target: { value: '2023-02-21T06:30:00.000Z' } });
        fireEvent.change(endDate, { target: { value: '2023-02-21T09:30:00.000Z' } });
        fireEvent.change(label, { target: { value: 'Month' } });

        fireEvent.click(filterButton);

        // Wait for the data to be loaded
        await waitFor(() => {
            //RangeData data to be available
            expect(screen.getByText('Monthly Time-Range')).toBeInTheDocument();
            expect(screen.getByText('Total Duration')).toBeInTheDocument();
            expect(screen.getByText('Sunday, February 5, 2023 12:00 AM - Saturday, February 11, 2023 12:00 AM')).toBeInTheDocument();

            //LogData data to be available
            expect(screen.getByText('Task-1')).toBeInTheDocument();
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.getByText('approved')).toBeInTheDocument();
        });
    });
})