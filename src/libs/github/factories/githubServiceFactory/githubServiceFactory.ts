import { type HttpService } from '../../../httpService/services/httpService/httpService.js';
import { type GithubService } from '../../services/githubService/githubService.js';
import { GithubServiceImpl } from '../../services/githubService/githubServiceImpl.js';

export class GithubServiceFactory {
  public static create(httpService: HttpService): GithubService {
    return new GithubServiceImpl(httpService);
  }
}
