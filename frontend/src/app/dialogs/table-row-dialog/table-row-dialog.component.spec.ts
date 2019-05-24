import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowDialogComponent } from './table-row-dialog.component';

describe('TableRowDialogComponent', () => {
	let component: TableRowDialogComponent;
	let fixture: ComponentFixture<TableRowDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableRowDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableRowDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
