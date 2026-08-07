import { test, expect } from '@playwright/test';
import { GeneratePage } from '../pages/GeneratePage';
import { Skill } from '../helpers/Skills';
import { SocialPlatform } from '../helpers/Social';

test('Navigate to webpage and fill select input fields', async ({ page }) => {
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

    // Select skills from predefined Skill list
    // TODO Fix skill selection, checkboxes are not being selected properly
    // await generatePage.selectSkills([Skill.Javascript, Skill.Python, Skill.VueJS]);
    // await expect(page.locator(`#${Skill.Javascript}`)).toBeChecked();
    // await expect(page.locator(`#${Skill.Python}`)).toBeChecked();
    // await expect(page.locator(`#${Skill.VueJS}`)).toBeChecked();

    // Fill social media input fields
    await generatePage.fillSocial(SocialPlatform.Twitter, '@johndoe');
    await generatePage.fillSocial(SocialPlatform.GitHub, 'nicholaschug');
    await expect(page.locator(`#${SocialPlatform.Twitter}`)).toHaveValue('@johndoe');
    await expect(page.locator(`#${SocialPlatform.GitHub}`)).toHaveValue('nicholaschug');

    // Check off 'Display Top Skills' element and change Title Colour to Cyan (52, 235, 219)
    await expect(generatePage.topSkillsCheckbox).toBeVisible();
    await expect(generatePage.topSkillsCheckbox).toBeEnabled();
    // Need to force check due to checkbox element being custom-styled and not a standard HTML checkbox
    await generatePage.topSkillsCheckbox.check({ force: true });
    await expect(generatePage.topSkillsCheckbox).toBeChecked();

    // Find and click the "Generate README" button
    await expect(generatePage.generateREADMEButton).toBeVisible();
    await expect(generatePage.generateREADMEButton).toBeEnabled();
    await generatePage.generateREADMEButton.click();
});