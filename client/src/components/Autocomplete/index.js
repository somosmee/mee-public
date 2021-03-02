import React, { PureComponent } from 'react'
import Select from 'react-select'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import NoSsr from '@material-ui/core/NoSsr'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import styled from './styles'

const NoOptionsMessage = (props) => (
  <Typography
    color='textSecondary'
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
)

const inputComponent = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />

const Control = ({ helperText, meta, input: { name }, ...rest }) => (props) => (
  <TextField
    helperText={helperText && (meta.touched ? meta.error : undefined)}
    error={!!meta.error && meta.touched}
    name={name}
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps
      }
    }}
    {...rest}
    {...props.selectProps.textFieldProps}
  />
)

const Option = (props) => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component='div'
    style={{ fontWeight: props.isSelected ? 800 : 400 }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
)

const Placeholder = (props) => (
  <Typography
    color='textSecondary'
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
)

const SingleValue = (props) => (
  <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
    {props.children}
  </Typography>
)

const ValueContainer = (props) => (
  <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
)

const Menu = (props) => (
  <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
    {props.children}
  </Paper>
)

class Autocomplete extends PureComponent {
  state = {
    selected: null
  }

  handleChange = (selected) => {
    this.setState({ selected })
    const { onSelected } = this.props
    onSelected && onSelected(selected)
  }

  render() {
    const {
      classes,
      className,
      placeholder,
      suggestions,
      onSelected,
      ...textFieldProps
    } = this.props
    const { selected } = this.state

    return (
      <div className={classNames(classes.root, className)}>
        <NoSsr>
          <Select
            classes={classes}
            options={suggestions.map((suggestion) => ({
              ...suggestion,
              value: suggestion.name,
              label: suggestion.name
            }))}
            components={{
              Control: Control(textFieldProps),
              Menu,
              NoOptionsMessage,
              Option,
              Placeholder,
              SingleValue,
              ValueContainer
            }}
            value={selected}
            onChange={this.handleChange}
            placeholder={placeholder}
            isClearable
          />
        </NoSsr>
      </div>
    )
  }
}

Autocomplete.propTypes = {
  suggestions: PropTypes.array
}

Autocomplete.defaultProps = {
  suggestions: []
}

export default styled(Autocomplete)
