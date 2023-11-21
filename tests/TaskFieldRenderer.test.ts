/**
 * @jest-environment jsdom
 */
import moment from 'moment';
import { FieldLayoutDetail, FieldLayoutsContainer } from '../src/TaskFieldRenderer';
import { TaskBuilder } from './TestingTools/TaskBuilder';

window.moment = moment;

describe('Field Layouts Container tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-11-19'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should get the data attribute of an existing component (date)', () => {
        const container = new FieldLayoutsContainer();
        const task = new TaskBuilder().dueDate('2023-11-20').build();

        const dueDateDataAttribute = container.dataAttribute('dueDate', task);

        expect(Object.keys(dueDateDataAttribute).length).toEqual(1);
        expect(dueDateDataAttribute['taskDue']).toEqual('future-1d');
    });

    it('should get the data attribute of an existing component (not date)', () => {
        const container = new FieldLayoutsContainer();
        const task = TaskBuilder.createFullyPopulatedTask();

        const dueDateDataAttribute = container.dataAttribute('priority', task);

        expect(Object.keys(dueDateDataAttribute).length).toEqual(1);
        expect(dueDateDataAttribute['taskPriority']).toEqual('medium');
    });

    it('should return empty data attributes dictionary for a missing component', () => {
        const container = new FieldLayoutsContainer();
        const task = new TaskBuilder().build();

        const dueDateDataAttribute = container.dataAttribute('recurrenceRule', task);

        expect(Object.keys(dueDateDataAttribute).length).toEqual(0);
    });
});

describe('Field Layout Detail tests', () => {
    it('should supply a class name and a data attribute name', () => {
        const fieldLayoutDetail = new FieldLayoutDetail('stuff', 'taskAttribute', () => {
            return '';
        });
        expect(fieldLayoutDetail.className).toEqual('stuff');
        expect(fieldLayoutDetail.attributeName).toEqual('taskAttribute');
    });

    it('should calculate data attribute value', () => {
        const fieldLayoutDetail = new FieldLayoutDetail('foo', 'bar', () => {
            return 'someValue';
        });
        const attributeValue = fieldLayoutDetail.attributeValueCalculator('createdDate', new TaskBuilder().build());
        expect(attributeValue).toEqual('someValue');
    });

    it('should return a data attribute', () => {
        const fieldLayoutDetail = new FieldLayoutDetail('dataAttributeTest', 'aKey', () => {
            return 'aValue';
        });
        const dataAttribute = fieldLayoutDetail.dataAttribute('description', new TaskBuilder().build());

        expect(Object.keys(dataAttribute).length).toEqual(1);
        expect(dataAttribute['aKey']).toEqual('aValue');
    });
});
