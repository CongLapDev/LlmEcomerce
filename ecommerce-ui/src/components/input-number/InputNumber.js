import React, { useState } from 'react';
import style from './style.module.scss';
import clsx from 'clsx';
import ButtonGroup from 'antd/es/button/button-group';

function InputNumber({ className, onChange, disabled, min = 1, max, value, ...props }) {
    // Normalize the incoming value prop — never start with undefined/null/0
    const safeInitial = () => {
        const parsed = Number.parseInt(value);
        if (isNaN(parsed) || parsed < min) return min;
        if (max !== undefined && parsed > max) return max;
        return parsed;
    };

    const [qty, setQty] = useState(safeInitial);

    const atMin = qty <= min;
    const atMax = max !== undefined && qty >= max;

    function clamp(val) {
        let v = Number.parseInt(val);
        if (isNaN(v) || v < min) v = min;
        if (max !== undefined && v > max) v = max;
        return v;
    }

    function commit(next) {
        setQty(next);
        if (onChange) onChange(next);
    }

    function increase() {
        if (atMax) return;
        commit(qty + 1);
    }

    function decrease() {
        if (atMin) return;
        commit(qty - 1);
    }

    function handleChange(e) {
        commit(clamp(e.target.value));
    }

    return (
        <ButtonGroup className={clsx(className, style.inputNumber)}>
            {!disabled && (
                <button
                    onClick={decrease}
                    disabled={atMin}
                    style={{ opacity: atMin ? 0.4 : 1, cursor: atMin ? 'not-allowed' : 'pointer' }}
                >
                    -
                </button>
            )}
            <input
                type="number"
                min={min}
                max={max}
                value={qty}
                onChange={handleChange}
                disabled={disabled}
                {...props}
            />
            {!disabled && (
                <button
                    onClick={increase}
                    disabled={atMax}
                    style={{ opacity: atMax ? 0.4 : 1, cursor: atMax ? 'not-allowed' : 'pointer' }}
                >
                    +
                </button>
            )}
        </ButtonGroup>
    );
}

export default InputNumber;