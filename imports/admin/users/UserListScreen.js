import { Component } from 'react'
import cx from '/imports/utils/classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Methods } from 'meteor/npdev:async-proxy'
import { withStyles } from '@material-ui/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import LoadingOverlay from 'react-loading-overlay'
import { DialogTitle, Menu, MenuItem, Typography, TextField } from '@material-ui/core'
import moment from 'moment'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const columnData = [
  { id: 'username', numeric: false, disablePadding: true, label: 'Username' },
  { id: 'roles', numeric: false, disablePadding: true, label: 'Roles' },
  { id: 'createdAt', numeric: false, disablePadding: true, label: 'CreatedAt' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' }
]

class EnhancedTableHead extends Component {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  }
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric.toString()}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      } : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  },
  btnTile: {
    margin: '0% 0% 0% 5%'
  }
})

class EnhancedTableToolbar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
  }

  render() {
    const { numSelected, classes } = this.props

    return (
      <Toolbar
        className={cx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
              <Typography variant="h6" id="tableTitle">
                Users
              </Typography>
            )}
        </div>
        <div className={classes.btnTile}>
          <Button variant="contained" color="primary" className={classes.button} component={Link} to="/admin/users/create">Add&nbsp;User</Button>
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
        </div>
      </Toolbar>
    )
  }
}

const EnhancedTableToolbarStyled = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  button: {
    margin: theme.spacing(1)
  }
})

class EnhancedTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    deleteMe: null,
    formMe: null,
    openDeleteDialog: false,
    openFormDialog: false,
    count: -1,
    isLoaderStatus: false,
    groupLimit: '',
    error: '',
    anchorEl: null
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { rowsPerPage, page, order, orderBy } = this.state
    this.setState({ isLoaderStatus: true })
    let result, userCount
    try {
      await Promise.all([
        Methods.adminGetUsersPage(rowsPerPage, page * rowsPerPage, order === 'asc' ? 1 : -1, orderBy).then(res => {
          result = res
        }),
        Methods.adminGetUserCount().then(res => {
          userCount = res
        })
      ])
      await this.setState({
        data: result,
        count: userCount,
        isLoaderStatus: false
      })
    } catch (error) {
      await this.setState({
        isLoaderStatus: false
      })
      console.error(error)
      return
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy }, this.fetchData)
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page }, this.fetchData)
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value }, this.fetchData)
  }

  handleCloseDeleteDialog = () => {
    this.setState({ deleteMe: null, openDeleteDialog: false })
  }

  handleCloseFormDialog = () => {
    this.setState({ formMe: null, openFormDialog: false })
  }

  handleDeleteClick = (event, user) => {
    event.preventDefault()
    this.setState({ deleteMe: user, openDeleteDialog: true })
  }

  handleDelete = async (event, id) => {
    event.preventDefault()
    try {
      await Methods.adminDeleteUserData(id)
    } catch (error) {
      console.error(error)
      return
    }
    this.setState({ deleteMe: null, openDeleteDialog: false })
    // refresh the data
    this.fetchData()
  }

  handleGroupLimitChange = ({ target }) => this.setState({ groupLimit: target.value })
  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes } = this.props
    const { data, order, orderBy, error, groupLimit, selected, rowsPerPage, page, count } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage)

    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <div>
          <LoadingOverlay className='admin-loader' active={this.state.isLoaderStatus} spinner text='Please wait' />
          <Paper className={classes.root} >
            <EnhancedTableToolbarStyled numSelected={selected.length} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={count}
                />
                <TableBody>
                  {data
                    .map(n => {
                      const isSelected = this.isSelected(n._id)
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n._id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isSelected}
                              onClick={event => this.handleClick(event, n._id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {n.username}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {n.roles.join()}
                          </TableCell>
                          <TableCell>{moment(n.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                          <TableCell>
                            <Button size="small" variant="contained" color="default" className={classes.button} component={Link} to={`/admin/users/view-${n._id}`}>View</Button>
                            <Button size="small" variant="contained" color="primary" className={classes.button} component={Link} to={`/admin/users/edit-${n._id}`}>Edit</Button>
                            <Button size="small" variant="contained" color="secondary" className={classes.button} onClick={(event) => this.handleDeleteClick(event, n)}>Delete</Button>
                        </TableCell>
                        </TableRow>
                      )
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />

            <Dialog
              open={this.state.openDeleteDialog}
              onClose={this.handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the user "{this.state.deleteMe?.username}"?
            </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDeleteDialog}>
                  Cancel
            </Button>
                <Button onClick={event => this.handleDelete(event, this.state.deleteMe._id)} autoFocus>
                  Delete
            </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </div>
      </ClickAwayListener>
    )
  }
}

const EnhancedTableWithStyle = withStyles(styles)(EnhancedTable)
export default EnhancedTableWithStyle
