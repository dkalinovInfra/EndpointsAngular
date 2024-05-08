import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WeatherAPIService } from './weather-api.service';

describe('WeatherAPIService', () => {
  let service: WeatherAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WeatherAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
