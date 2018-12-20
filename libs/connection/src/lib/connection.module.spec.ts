import { async, TestBed } from '@angular/core/testing';
import { ConnectionModule } from './connection.module';

describe('ConnectionModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ConnectionModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ConnectionModule).toBeDefined();
  });
});
