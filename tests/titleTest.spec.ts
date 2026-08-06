import { test, expect } from '@playwright/test';
import { GeneratePage } from '../pages/GeneratePage';

test('Generate text', async ({ page }) => {
    const generatePage = new GeneratePage(page);

    // Assert that webpage loads correctly and has the expected title
    await generatePage.goTo('https://rahuldkjain.github.io/gh-profile-readme-generator/');
    await expect(generatePage.page).toHaveTitle("GitHub Profile Readme Generator | GitHub Profile Readme Generator");

    // Fill in the title and subtitle input fields
    await generatePage.titleInputField.fill('John Doe');
    await generatePage.subtitleInputField.clear();
    await generatePage.subtitleInputField.fill('Your Friendly Neighbourhood Developer');

    // Fill in the current work project and collaboration input fields
    await generatePage.currentWorkProjectInputField.fill('Open Source Project');
    await generatePage.currentWorkProjectLinkInputField.fill('https://github.com/open-source-project');
    await generatePage.collaborationInputField.fill('Collaboration Project');
    await generatePage.collaborationLinkInputField.fill('https://github.com/collaboration-project');

    const selectedIds = await generatePage.selectRandomCheckboxes('Programming Languages', 2);
    expect(selectedIds).toHaveLength(2);

    for (const id of selectedIds) {
        await expect(page.locator(`#${id}`)).toBeChecked();
    }

    // Click the generate button
    // await generatePage.clickGenerateButton();

    // Expect the generated text to contain the title and subtitle
    // const generatedText = await generatePage.getGeneratedText();
    // expect(generatedText).toContain('My Title');
    // expect(generatedText).toContain('My Subtitle');
});