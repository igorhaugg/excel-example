import React, { Component } from 'react';

import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  withStyles
} from '@material-ui/core';

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage
} from '@material-ui/icons';

class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPage />
        </IconButton>
      </div>
    );
  }
}

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

const TablePaginationActionsWrapped = withStyles(actionsStyles)(
  TablePaginationActions
);

class ExcelTable extends Component {
  state = {
    page: 0,
    rowsPerPage: 5
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { rowsPerPage, page } = this.state;
    const { classes } = this.props;
    let { fileData } = this.props;
    let tableHead = fileData.slice(0, 1);
    let tableBody = fileData.slice(1, fileData.length);
    let emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, tableBody.length - page * rowsPerPage);

    // replace empty cells to have an empty text and not an empty value
    for (let i = 0; i < tableBody.length; i++) {
      let line = tableBody[i];
      for (let j = 0; j < line.length; j++) {
        if (!line[j]) {
          line[j] = ' ';
        }
      }
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableHead[0].map((col, index) => {
                  return (
                    <TableCell
                      className={classes.tableCell}
                      component="th"
                      scope="row"
                      key={index}
                    >
                      {col}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableBody
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((line, indexLine) => {
                  return (
                    <TableRow key={indexLine}>
                      {line.map((col, indexCol) => {
                        return (
                          <TableCell component="th" scope="row" key={indexCol}>
                            {col}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={tableBody[0].length} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={tableBody.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '95%'
  },
  table__head: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    minWidth: '100px',
    textAlign: 'center'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table__require: {
    color: 'red',
    fontWeight: 'bold'
  },
  select: {
    margin: '0 0 0.5rem 0 !important',
    width: '100%'
  },
  tableCell: {
    padding: '10px !important'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing.unit * 3,
    width: '100%'
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
});

export default withStyles(styles)(ExcelTable);
