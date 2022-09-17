import React from 'react';

import ContextProvider from '../../util/ContextProvider';

const MoneySymbol = ({ moneyIcon, prefix }) => (
    <ContextProvider.Consumer>
        {
            ctx => (
                <span>{(prefix) ? ((moneyIcon || ctx.moneyIcon) + " ") : (" " + (moneyIcon || ctx.moneyIcon))}</span>
            )
        }
    </ContextProvider.Consumer>
);

MoneySymbol.defaultProps = {
    prefix: false
};

export default MoneySymbol;