import React, { Fragment } from 'react';

class PageList extends React.PureComponent {
	calculateTotalPages( totalCount, itemsPerPage ) {
		return Math.ceil( totalCount / itemsPerPage );
	}

	renderPageLink( page, currentPage ) {
		let pageOutput = page;
		if ( parseInt( currentPage ) === page ) {
			pageOutput = <strong>{ page }</strong>
		}

		return <Fragment key={ `page-${ page }` }>
			<a href={ `?page=${ page }` }>{ pageOutput }</a>
			<span style={{ margin: '0 3px 0 3px' }}>/</span>
		</Fragment>
	}

	render() {
		const { currentPage, itemsPerPage, totalCount } = this.props;
		const totalPages = this.calculateTotalPages( totalCount, itemsPerPage );
		
		let pagesOutput = [];
		for ( let i = 1; i <= totalPages; i++ ) {
			pagesOutput.push( this.renderPageLink( i, currentPage ) );
		}
		
		return pagesOutput;
	}
}

export default PageList;
