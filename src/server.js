// src/server.js
import { Server, Factory, Model, JSONAPISerializer } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
	let server = new Server({
		environment,

		models: {
			entry: Model,
		},

		serializers: {  application: JSONAPISerializer,  },

		factories: {
			entry: Factory.extend( { name( i ) { return `Name ${ i }` } } ),
		},

		seeds(server) {
			server.createList( 'entry', 100 );
			// server.create("entry", { name: "Bob", notes: 'aaa', sign_out: null })
			// server.create("entry", { name: "Alice", notes: 'bbb', sign_out: null })
		},

		routes() {
			this.namespace = "api"
			this.urlPrefix = 'https://mini-visitors-service.herokuapp.com/';

			this.get("/entries", function( schema, request ) {
				let entries = schema.entries.all();

				// Filter
				let value = request.queryParams["filter[notes]"];
				if (value) {
					let matcher = new RegExp(value, "gi");
					entries = entries.filter(entry => matcher.test(entry["notes"]));
				}

				// Pagination
				let page = request.queryParams["page"];
				if (page) {
					let pageSize = 10;
					let itemCount = entries.length;
					let pageCount = Math.ceil(itemCount / pageSize);
					let start = (page - 1) * pageSize;
					let end = page * pageSize;

					let paginatedVisitors = entries.slice(start, end);
					let json = this.serialize( paginatedVisitors );
					json.meta = { itemCount, page, pageCount };

					return json;
				}

				return entries;
			})
		},
	})

	return server
}