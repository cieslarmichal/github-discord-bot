import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type SendIssueCreatedMessageCommandHandler } from './sendIssueCreatedMessageCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { symbols } from '../../../symbols.js';
import { IssueTestFactory } from '../../../tests/factories/issueTestFactory/issueTestFactory.js';
import { IssueTestUtils } from '../../../tests/utils/issueTestUtils/issueTestUtils.js';

describe('SendIssueCreatedMessageCommandHandler', () => {
  let sendIssueCreatedMessageCommandHandler: SendIssueCreatedMessageCommandHandler;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let issueTestUtils: IssueTestUtils;

  const issueTestFactory = new IssueTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    sendIssueCreatedMessageCommandHandler = container.get<SendIssueCreatedMessageCommandHandler>(symbols.sendIssueCreatedMessageCommandHandler);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    issueTestUtils = new IssueTestUtils(postgresDatabaseClient);

    await issueTestUtils.truncate();
  });

  afterEach(async () => {
    await issueTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  it('creates a issue', async () => {
    const { title, releaseYear, authorId } = issueTestFactory.create();

    const { issue } = await sendIssueCreatedMessageCommandHandler.execute({
      title,
      releaseYear,
      authorId,
    });

    const foundIssue = await issueTestUtils.findByTitleAndAuthor({
      title,
      authorId,
    });

    expect(issue.title).toEqual(title);

    expect(issue.authorId).toEqual(authorId);

    expect(foundIssue.title).toEqual(title);

    expect(foundIssue.authorId).toEqual(authorId);
  });

  it('throws an error when issue with the same title and author already exists', async () => {
    const existingIssue = await issueTestUtils.createAndPersist();

    try {
      await sendIssueCreatedMessageCommandHandler.execute({
        title: existingIssue.title,
        releaseYear: existingIssue.releaseYear,
        authorId: existingIssue.authorId,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      return;
    }

    expect.fail();
  });
});
