import React from 'react';
import PropTypes from 'prop-types';

/**
 * Output sign out options.
 *
 * @param  {String} signOutStatus Current sign out status of the user.
 * @param  {Number} id            The id of the user.
 * @return {XML}
 */
const outputSignoutOptions = ( signOutStatus, id, onSignOut ) => {
	if ( ! signOutStatus ) {
		return <button className="btn btn--smaller btn--outline" onClick={ () => onSignOut( id ) }>Sign out</button>
	}

	const signOutDateTime = new Date( Date.parse( signOutStatus ) );
	let hours = signOutDateTime.getHours();
  let minutes = signOutDateTime.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? `0${ minutes }` : minutes;

	return `${ signOutDateTime.getMonth() + 1 } / ${ signOutDateTime.getDate() } / ${ signOutDateTime.getFullYear() } ${ hours }:${ minutes }${ ampm }`;
}

const GuestListRow = props => {
	const { id, guest, onSignOut } = props;
	const { name, notes, sign_out } = guest;

	return (
		<tr>
			<td className="p-2 border-t border-grey-light font-mono text-xs">{ name }</td>
			<td className="p-2 border-t border-grey-light font-mono text-xs">{ notes }</td>
			<td className="p-1 border-t border-grey-light font-mono text-xs">{ outputSignoutOptions( sign_out, id, onSignOut ) }</td>
		</tr>
	);
}

GuestListRow.defaultProps = {
	guest:     {},
	onSignOut: () => {},
};

GuestListRow.propTypes = {
	id:    PropTypes.number,
	guest: PropTypes.shape( {
    name:     PropTypes.string,
    notes:    PropTypes.string,
    sign_out: PropTypes.string,
  } ),
  onSignOut: PropTypes.func,
};

export default GuestListRow;
