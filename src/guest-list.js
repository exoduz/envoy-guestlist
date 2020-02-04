import React, { Fragment } from 'react';
import axios from 'axios';

import { getApiDetails, buildPayload } from './api';
import AddGuestForm from './add-guest-form';
import GuestListRow from './guest-list-row';
import PageList from './page-list';

class GuestList extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			guests:             [],
			newVisitorFormOpen: false,
			search:             '',
		}

		this.searchRef = React.createRef();

		this.toggleNewVisitorForm = this.toggleNewVisitorForm.bind( this );
		this.addGuestToState = this.addGuestToState.bind( this );
		this.signOut = this.signOut.bind( this );
		this.handleSearchChange = this.handleSearchChange.bind( this );
	}

	componentDidMount() {
		const urlParams = new URLSearchParams( window.location.search );
		const urlParamsPage = urlParams.has( 'page' );
		let queryString = '';

		if ( urlParamsPage ) {
			queryString = `?page=${ urlParams.get( 'page' ) }`;
		}

		// Get API details.
		const apiDetails = getApiDetails();
		// Get all relevant information.
		const { url , options } = apiDetails;

		axios.get( `${ url }${ queryString }`, options )
			.then( response => {
				// Set guests to state.
				this.setState( {
					guests: response.data.data,
					meta:   response.data.meta,
				} );
			} );
	}

	toggleNewVisitorForm( event ) {
		event.preventDefault();

		const { newVisitorFormOpen } = this.state;
		this.setState( { newVisitorFormOpen: ! newVisitorFormOpen } );
	}

	/**
	 * Add all the guests to the state for output.
	 *
	 * @param {Object} value New guest information.
	 */
	addGuestToState( value ) {
		// Add the new value to current guests in state.
		var joined = this.state.guests.concat( value );
		this.setState( { guests: joined } );
	}

	/**
	 * Actually sign out the user.
	 *
	 * @param  {Number} id The id of the user.
	 */
	signOut( id ) {
		// Create payload object.
		const payload = Object.assign( {}, { id } );
		// Build payload.
		const data = buildPayload( payload );

		// Get API details.
		const apiDetails = getApiDetails();
		// Get all relevant information.
		const { url, options } = apiDetails;
		const signOutUrl = `${ url }/sign_out`;

		axios.post( signOutUrl, data, options )
			.then( response => {
				// Update the state for the signed out user.
				const guestIndexToUpdate = this.state.guests.findIndex( element => element.id === id );
				// Update the guest's sign_out value in state from the return.
				if ( guestIndexToUpdate !== -1 ) {
					let newState = Object.assign( {}, this.state );
					newState.guests[ guestIndexToUpdate ] = response.data.data;
					this.setState( newState );
				}
			} );
	}

	handleSearchChange( event ) {
		this.setState( { search: event.target.value } );
	}

	render() {
		const {
			guests,
			meta,
			newVisitorFormOpen,
			search,
		} = this.state;

		console.log( 111, meta );

		let sortedGuests = [];

		if ( Array.isArray( guests ) && sortedGuests.length > 0 ) {
			// Search and filter the results.
			sortedGuests = search
					? guests.filter( guest => guest.attributes.name && guest.attributes.name.includes( search ) )
					: guests;

			// Sort the guest details by newest first.
			sortedGuests.sort( ( a, b ) => b.id - a.id );
		} else {
			sortedGuests = guests;
		}

		return (
			<div className="container mx-auto mt-12 p-8 border min-h-screen max-w-3xl">
				<div className="clearfix search-box">
					<input
						type="text"
						className="p-2 text-sm border float-right max-w-xs w-full"
						onChange={ this.handleSearchChange }
						placeholder="Search"
					/>
					
					<img src="https://dashboard.envoy.com/assets/images/logo-small-red-ba0cf4a025dd5296cf6e002e28ad38be.svg" alt="Envoy Logo" width="31" className="py3 block" />
				</div>

				<div className="clearfix add-guest-form__container">
					<div className="btn--add__container">
						<button className="btn btn--brand btn--add ml-2" onClick={ this.toggleNewVisitorForm }>
							{ newVisitorFormOpen
								? <Fragment>
									<span className="fas fa-times" role="img"></span>
									&nbsp;&nbsp;
									Close New Visitor Form
								</Fragment>
								: <Fragment>
									<span className="fas fa-user" role="img"></span>
									&nbsp;&nbsp;
									New visitor
								</Fragment>
							}
						</button>
					</div>

					{ newVisitorFormOpen && <AddGuestForm onAddComplete={ this.addGuestToState } /> }
				</div>

				{ typeof meta !== 'undefined'
					&& <PageList
						currentPage={ meta.page }
						itemsPerPage={ meta.pageCount }
						totalCount={ meta.itemCount }
					/>
				}

				<div className="flex-grow h-screen overflow-y-scroll">
					<div className="mx-auto">

						<div className="mt-8">
							<table className="w-full">
								<thead>
									<tr>
										<th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Name</th>
										<th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Notes</th>
										<th className="text-sm font-semibold text-grey-darker p-1 bg-grey-lightest">Signed out</th>
									</tr>
								</thead>
								<tbody className="align-baseline">
									{ sortedGuests.length > 0
										&& sortedGuests.map( guest => <GuestListRow
											key={ guest.id }
											id={ guest.id }
											guest={ guest.attributes }
											onSignOut={ this.signOut }
										/> )
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default GuestList;
