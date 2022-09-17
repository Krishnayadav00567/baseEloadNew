import _ from 'lodash';

export  const searchInputHandle = value => {
    if(value) {
        return value;
    }else {
        return '';
    }
}