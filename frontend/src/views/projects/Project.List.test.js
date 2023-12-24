import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List from './List';
import { ProjectService } from '../../services/api.service.js';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigator
}));

jest.mock('../../services/api.service.js', () => ({
    ProjectService: {
        getList: jest.fn(() => Promise.resolve({ data: [] })),
    }

}));

describe('Projects component', () => {
    beforeEach(() => {
        render(<List />)
    })

    it('should render Project List component with heading text correctly', () => {

        const HeaderText = screen.getByText('Project List')
        expect(HeaderText).toBeInTheDocument();
    });

    it('should render loader when project data are loading', () => {

        const loaderStatus = screen.queryByTestId('loader')

        expect(loaderStatus).toBeInTheDocument()
    })

    it('should render project list correctly', async () => {

        const mockData = [
            { id: 1, projectName: 'Project 1', description: 'Description 1' },
            { id: 2, projectName: 'Project 2', description: 'Description 2' },
        ]

        ProjectService.getList.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <List />
            );
        });

        const projectID = screen.getByText('1')
        const projectName = screen.getByText('Project 1')
        const projectDescription = screen.getByText('Description 1')

        expect(projectID).toBeInTheDocument();
        expect(projectName).toBeInTheDocument();
        expect(projectDescription).toBeInTheDocument();

        // Check if the "View" button is present
        const viewButtons = screen.getAllByTestId('view-button')
        expect(viewButtons).toHaveLength(2);
    });

    it('should handle onClick event and navigate to desired route', async () => {
        const mockData = [
            { id: 1, projectName: 'Project-1', description: 'Description 1' },
        ]

        ProjectService.getList.mockResolvedValueOnce({ data: mockData });

        await act(async () => {
            render(
                <List />
            );
        });

        // Check if the "View" button is present
        const viewButton = screen.getByTestId('view-button')
        expect(viewButton).toBeInTheDocument();

        // // Simulate a click on the "View" button
        userEvent.click(viewButton);
        expect(mockedNavigator).toHaveBeenCalledWith('/projects/Project-1/1');
    })
});