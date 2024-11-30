import _ from 'lodash';

export default function isEqual(a, b) {
    return _.isEqual(a, b);
}

export const isEqualWithoutFields = (obj1, obj2, fieldsToIgnore = []) => {
    const filteredObj1 = _.omit(obj1, fieldsToIgnore);
    const filteredObj2 = _.omit(obj2, fieldsToIgnore);
    
    return _.isEqual(filteredObj1, filteredObj2);
  };

