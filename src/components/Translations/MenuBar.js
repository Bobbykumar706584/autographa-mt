import React, { Component } from "react";
import { DialogTitle, Grid, MenuItem } from "@material-ui/core";
import { Button, Checkbox } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import { books } from "../Common/BibleOldNewTestment";

const styles = (theme) => ({
	bookBtn: {
		marginTop: "15px",
		marginLeft: "15px",
	},
	uploadChip: {
		marginTop: "10px",
	},
	roundedBtn: {
		border: "1px solid #8c8c8c",
		margin: 2,
		paddingLeft: 6,
		borderRadius: "10px",
	},
	boxTitle: {
		textAlign: "center",
		background: "#eee",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	chipContainer: {
		overflow: "auto",
		maxHeight: "78px",
		paddingTop: 5,
	},
	chip: {
		margin: 2,
	},
});

class MenuBar extends Component {
	state = {
		selectbook: "",
		open: false,
		checkedItems: new Map(),
	};

	handleChange = (e) => {
		const item = e.target.value;
		const isChecked = e.target.checked;
		this.setState((prevState) => ({
			checkedItems: prevState.checkedItems.set(item, isChecked),
		}));
	};

	// sort the books in bible order
	displayBooks() {
		const { userProjects, location } = this.props;

		if (userProjects.length > 0) {
			const data = userProjects.filter(
				(project) =>
					project.projectId ===
					parseInt(location.pathname.split("/").pop())
			);
			let assignedBooks = [];
			books.map((book) => {
				//map function for pushing the books in order
				return data[0].books.includes(book)
					? assignedBooks.push(book)
					: null;
			});
			return assignedBooks.map((item) => {
				//map function for displaying books on UI
				console.log(this.state.checkedItems);
				return (
					<Grid
						item
						xs={2}
						key={item}
						className={this.props.classes.roundedBtn}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.checkedItems.get(item)}
									onChange={this.handleChange}
									value={item}
									color="primary"
								/>
							}
							label={item.toUpperCase()}
						/>
					</Grid>
				);
			});
		} else {
			return (
				<MenuItem key="" value="" disabled>
					No books assigned
				</MenuItem>
			);
		}
	}

	onSelect = (e) => {
		this.setState({
			selectbook: e.target.value,
		});
		this.props.updateState(e.target.value);
	};

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Grid container>
					<Grid item xs={11} className={classes.chipContainer}>
						{books.map((item) => (
							<Chip
								color="primary"
								label={item}
								className={classes.chip}
							/>
						))}
					</Grid>
					<Grid item xs={1}>
						<Button
							className={classes.bookBtn}
							size="small"
							variant="contained"
							color="primary"
							onClick={this.handleOpen}
						>
							Books
						</Button>
					</Grid>
				</Grid>

				{/* open box for books to tokenize */}
				<Dialog open={this.state.open}>
					<DialogTitle className={classes.boxTitle}>
						<span className={classes.title}>Books to Tokenize</span>
					</DialogTitle>

					<DialogContent>
						<Grid container justify="center">
							{this.displayBooks()}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.handleClose}
							variant="contained"
							color="secondary"
						>
							Close
						</Button>
						<Button variant="contained" color="primary">
							Tokenize
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userProjects: state.project.userProjects,
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(withRouter(MenuBar));
