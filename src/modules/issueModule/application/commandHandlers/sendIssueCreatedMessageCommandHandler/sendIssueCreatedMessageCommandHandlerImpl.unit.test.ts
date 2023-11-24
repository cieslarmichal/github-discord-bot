import { expect, it, describe, vi } from 'vitest';

import { type SendIssueCreatedMessageCommandHandler } from './sendIssueCreatedMessageCommandHandler.js';
import { SpyFactory } from '../../../../../common/tests/spyFactory.js';

describe('SendIssueCreatedMessageCommandHandler', () => {
  const spyFactory = new SpyFactory(vi);

  let sendIssueCreatedMessageCommandHandler: SendIssueCreatedMessageCommandHandler;

  let issueTestUtils: IssueTestUtils;

  const issueTestFactory = new IssueTestFactory();

  it('creates a issue', async () => {
    spyFactory.create({}, 'create').mockImplementation(async () => {
      return unitOfWork;
    });

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
