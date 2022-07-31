import { TestBed } from '@angular/core/testing';
import { Migration } from '../models/migration.model';
import { DataBaseService, StatementData } from '../modules/data-base-service/data-base.service';
import { DummyDataBaseService } from '../modules/data-base-service/dummy-data-base.service';
import { MigrationService } from './migration.service';

const MIG: Migration[] = [
  {
    appVersion: "0.0.1",
    Up() {
      return { statement: "0.0.1" } as StatementData
    }
  } as Migration,
  {
    appVersion: "0.0.3",
    Up() {
      return { statement: "0.0.3" } as StatementData
    }
  } as Migration,
  {
    appVersion: "0.0.2",
    Up() {
      return { statement: "0.0.2" } as StatementData
    }
  } as Migration,
  {
    appVersion: "0.0.5",
    Up() {
      return { statement: "0.0.5" } as StatementData
    }
    
  } as Migration,
  {
    appVersion: "0.0.4",
    Up() {
      return { statement: "0.0.4" } as StatementData
    }
  } as Migration,
]

describe('MigrationListService', () => {
  let service: MigrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DataBaseService,
          use: DummyDataBaseService
        },
        MigrationService
      ],
    });

    service = TestBed.inject(MigrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Версии миграций должны превышать запрошенную версию.', () => {
    //Указываю версию 0.0.3. В результате работы метода должы быть выбраны версии 0.0.4, 0.0.5. 
    //Отсортированы по возрастанию

    //set up
    const targetAppVersion = "0.0.3"

    //call method
    let statements = service.getMigrationStatementsForVersion(targetAppVersion, MIG);

    //Expected to finding 2 items, 0.0.4, 0.0.5
    expect(2).toEqual(statements.length);
    expect('0.0.4').toEqual(statements[0].statement);
    expect('0.0.5').toEqual(statements[1].statement);
  });

  it('Если не передать целевую версию, должжны быть предложены все имеющиеся миграции', () => {
    //Указываю версию null. В результате работы метода должы быть выбраны версии 0.0.1, 0.0.2, 0.0.3, 0.0.4, 0.0.5. 
    //Отсортированы по возрастанию

    //set up
    const targetAppVersion = null

    //call method
    let statements = service.getMigrationStatementsForVersion(targetAppVersion, MIG);

    //Expected to finding 5 items, 0.0.1, 0.0.2, 0.0.3, 0.0.4, 0.0.5
    expect(5).toEqual(statements.length);
    expect('0.0.1').toEqual(statements[0].statement);
    expect('0.0.2').toEqual(statements[1].statement);
    expect('0.0.3').toEqual(statements[2].statement);
    expect('0.0.4').toEqual(statements[3].statement);
    expect('0.0.5').toEqual(statements[4].statement);
  });

});

