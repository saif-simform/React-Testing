import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams } from 'react-router-dom';
import View from './View';
import { ProjectService } from '../../services/api.service.js';
import CreateTaskLogModal from "../timeLogs/CreateTaskLogModel";

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigator,
    useParams: jest.fn()
}));

jest.mock('../../services/api.service.js', () => ({
    ProjectService: {
        getByID: jest.fn(() => Promise.resolve({ data: [] })),
    }

}));


jest.mock('../timeLogs/CreateTaskLogModel.js', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue(<div data-testid="modal" />),
}));

describe('View component', () => {
    beforeEach(() => {
        const mockParams = { id: '1', projectName: 'Project-1' };
        useParams.mockReturnValue(mockParams)

        render(<View />)
    })

    it('should render View component with heading text correctly', () => {
        const HeaderText = screen.getByText('Task List')

        expect(HeaderText).toBeInTheDocument();
    });

    it('should render loader when data are loading', () => {
        const loaderStatus = screen.queryByTestId('loader')

        expect(loaderStatus).toBeInTheDocument()
    })

    it('should render task list correctly', async () => {
        const mockData = {
            tasks: [
                { id: 1, taskName: 'Task 1' },
                { id: 2, taskName: 'Task 2' },
            ],
        }

        ProjectService.getByID.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <View />
            );
        });

        const taskID = screen.getByText('1')
        const taskName = screen.getByText('Task 1')
        const projectName = screen.queryAllByText('Project-1')

        expect(taskID).toBeInTheDocument();
        expect(taskName).toBeInTheDocument();
        expect(projectName[0]).toBeInTheDocument();
    });

    it('should handle onClick event and navigate to specific route', async () => {

        const mockData = {
            tasks: [
                { id: 1, taskName: 'Task 1' }
            ],
        }

        ProjectService.getByID.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <View />
            );
        });

        // Check if the "View" button is present
        const viewButton = screen.getByTestId('view-button')
        expect(viewButton).toBeInTheDocument();

        // // Simulate a click on the "View" button
        userEvent.click(viewButton);
        expect(mockedNavigator).toHaveBeenCalledWith('/projects/Project-1/task/1');
    })

    it('should handle render CreateTaskLogModal correctly', async () => {
        const mockData = {
            tasks: [
                { id: 1, taskName: 'Task 1' }
            ],
        }

        ProjectService.getByID.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <View />
            );
        });

        // Check if the "Edit" button is present
        const editButton = screen.getByTestId('edit-button')
        expect(editButton).toBeInTheDocument();

        userEvent.click(editButton);
        expect(CreateTaskLogModal).toHaveBeenCalled();
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    })
})