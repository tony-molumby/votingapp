import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  }
})

class AddForm extends React.Component {
  state = {
    question: '',
    answers: []
  };

  handleChange = name => event => {
    if(name === 'question'){
        this.setState({[name]: event.value})
    } else {
        this.setState({ [this.state.answers.name]: event.value });
    }
  };


//   displayAnswers = (answer, i) => {
//     return (

//     )
//   }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
            id="question"
            label="Question for the Poll"
            className={classes.textField}
            value={this.state.question}
            onChange={this.handleChange('question')}
            margin="normal"
        />
      </form>
    );
  }
}

AddForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddForm);