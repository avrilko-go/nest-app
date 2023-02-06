import { isNil } from 'lodash';

export const toBoolean = (value?: string | boolean): boolean => {
    if (isNil(value)) {
        return false;
    }
    if (typeof value === 'boolean') {
        return value;
    }

    try {
        return JSON.parse(value.toLowerCase());
    } catch (e) {
        return value as unknown as boolean;
    }
};
