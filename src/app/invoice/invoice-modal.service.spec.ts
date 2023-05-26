import { TestBed } from '@angular/core/testing';

import { InvoiceModalService } from './invoice-modal.service';

describe('InvoiceModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceModalService = TestBed.get(InvoiceModalService);
    expect(service).toBeTruthy();
  });
});
