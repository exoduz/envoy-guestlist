import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Formik } from "formik";
import * as Yup from "yup";

import { getApiDetails, buildPayload } from './api';

const AddGuestForm = props => (
	<Formik
		initialValues={ {
			name: '',
			notes: '',
		} }

		onSubmit={ async ( values, { setSubmitting, resetForm } ) => {
			if ( ! values.name ) {
				return;
			}

			// Create payload object.
			const payload = Object.assign( {}, { attributes: values } );
			// Build payload.
			const data = buildPayload( payload );

			const { onAddComplete } = props;

			// Get API details.
			const apiDetails = getApiDetails();
			// Get all relevant information.
			const { url, options } = apiDetails;

			axios.post( url, data, options )
				.then( response => {
					// The action when complete.
					onAddComplete( response.data.data );

					// Reset the form.
					resetForm();
					setSubmitting( false );
				} );
		} }

		validationSchema={ Yup.object().shape( {
			name: Yup.string()
				.required( "Name is required" ),
			notes: Yup.string(),
		} ) }
	>
		{ props => {
			const {
				values,
				touched,
				errors,
				isSubmitting,
				handleChange,
				handleBlur,
				handleSubmit,
			} = props;

			return (
				<form className="add-guest-form" onSubmit={ handleSubmit }>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
							Name
						</label>
						<input
							id="name"
							type="text"
							value={ values.name }
							onChange={ handleChange }
							onBlur={ handleBlur }
							className={ `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
								${ errors.name && touched.name
									? "text-input error"
									: "text-input"
								}`
							}
						/>
						{ errors.name && touched.name && (
							<div className="form-error">{ errors.name }</div>
						) }
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
							Notes
						</label>
						<input
							id="notes"
							type="text"
							value={ values.notes }
							onChange={ handleChange }
							onBlur={ handleBlur }
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>

					<div className="btn--add__container">
						<button
							className="btn btn--brand btn--add ml-2"
							disabled={ isSubmitting }
							type="submit"
						>
							<span className="fas fa-user-plus" role="img" ></span>&nbsp;&nbsp;Add New Visitor
						</button>
					</div>

				</form>
			);
		} }
	</Formik>
);

AddGuestForm.defaultProps = { onAddComplete: () => {} };
AddGuestForm.propTypes = { onAddComplete: PropTypes.func };

export default AddGuestForm;
