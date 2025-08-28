// Column definition for reusable table component
export interface TableColumnType<T = any> {
	// Unique key matching the property in the row object
	key: string;
	// Header label text
	header: string;
	// Optional type to drive default rendering
	type?: 'text' | 'boolean-badge' | 'template';
	// Optional placeholder when value is empty / falsy (except boolean false)
	placeholder?: string;
	// Custom CSS classes for header / cell
	headerClass?: string;
	cellClass?: string;
	// Optional formatter if type === 'text'
	format?: (value: any, row: T) => string;
	// Badge config when type === 'boolean-badge'
	badge?: {
		true?: { text?: string; class?: string };
		false?: { text?: string; class?: string };
	};
	// When type === 'template' the component will look for a template with the same key
}
