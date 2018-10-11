import React, { Component, Fragment } from 'react';
import ReactDropzone from 'react-dropzone';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles
} from '@material-ui/core';

import * as XLSX from 'xlsx';

import ExcelTable from './Table';

class App extends Component {
  state = {
    file: '',
    fileName: '',
    fileSize: '',
    error: '',
    open: false
  };

  onDrop = files => {
    this.setState({ error: '' });
    files.forEach(file => {
      let extension = file.name.substr(file.name.lastIndexOf('.') + 1);
      if (extension !== 'xlsx' && extension !== 'xls') {
        return this.setState({
          error: `The file you tried to load have an invalid extension.
            Please select a XLSX or XLS file.`,
          open: true
        });
      }
      this.excel(file);
    });
  };

  handleRemove = e => {
    e.stopPropagation();
    return this.setState({ file: '' });
  };

  excel = file => {
    const reader = new FileReader();
    reader.onload = evt => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length > 100) {
        return this.setState({
          error:
            'The file was not loaded. Please insert a file with less than 100 rows.',
          open: true
        });
      }
      this.setState({
        file: data,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2)
      });
    };
    reader.readAsBinaryString(file);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderDialog = message => (
    <Dialog
      open={this.state.open}
      keepMounted
      onClose={this.handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{'Error!'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="secondary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  render() {
    const { file, fileName, fileSize, error } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.home}>
        <p className={classes.title}>Load an excel file</p>
        <ReactDropzone onDrop={this.onDrop} className={classes.dropzone}>
          {file ? (
            <Fragment>
              <div style={{ display: 'flex' }}>
                <span className={classes.dropzone__filename}>{fileName}</span>
                <span>: {fileSize} KB</span>
              </div>
              <div
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={this.handleRemove}
              >
                Remove file
              </div>
            </Fragment>
          ) : (
            <span className={classes.dropzone__message}>
              Click here or drag your file here to proceed
            </span>
          )}
        </ReactDropzone>
        {error && this.renderDialog(error)}
        {file && <ExcelTable fileData={file} />}
      </main>
    );
  }
}

const styles = theme => ({
  home: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '5rem',
    width: '100vw'
  },
  title: {
    fontSize: '36px',
    textAlign: 'center'
  },
  dropzone: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: '5px',
    border: '1px dashed #ccc',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '10px',
    minHeight: '60px',
    padding: '10px',
    width: '50vw'
  },
  dropzone__message: {
    fontSize: '15px'
  },
  dropzone__filename: {
    display: 'inline-block',
    paddingBottom: '5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100px'
  }
});

export default withStyles(styles)(App);
