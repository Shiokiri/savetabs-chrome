document.getElementById("getButton").addEventListener("click", async () => {
  const queryOptions = { lastFocusedWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);

  const extensionsFolderTitle = "Timeline";
  const data = new Date().toISOString().slice(0, 10);

  const tree = await chrome.bookmarks.getTree();
  const extensionsFolder = tree[0].children[0].children.find(
    (child) => child.title === extensionsFolderTitle
  );
  const currentExtensionsFolder =
    extensionsFolder == null
      ? await chrome.bookmarks.create({
          parentId: tree[0].children[0].id,
          title: extensionsFolderTitle,
        })
      : extensionsFolder;

  let currentDate = data,
    index = 1;
  while (
    currentExtensionsFolder.children.find(
      (child) => child.title === currentDate
    )
  ) {
    currentDate = data + `-${index}`;
    index++;
  }
  const currentDateFolder = await chrome.bookmarks.create({
    parentId: currentExtensionsFolder.id,
    title: currentDate,
  });
  for (const tab of tabs) {
    await chrome.bookmarks.create({
      parentId: currentDateFolder.id,
      title: tab.title,
      url: tab.url,
    });
  }
  //   await chrome.tabs.create({ active: true });
  //   await chrome.tabs.remove(tabs.map((t) => t.id));

  chrome.tabs.create({ active: false }, function () {
    console.log("tab created");
    chrome.tabs.remove(tabs.map((t) => t.id));
  });
});
