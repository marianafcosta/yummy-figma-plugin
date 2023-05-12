import { selectMenu, disclosure } from 'figma-plugin-ds';

disclosure.init()
selectMenu.init()

if (document.getElementById("settings-panel")) {
	document.getElementById("settings-panel").style.display = "none";
}

// Since the initially selected format is TSX, disable the effect export since we don't support TSX-compatible effects yet
if (document.getElementById('effect')) {
	document.getElementById('effect').disabled = true
}

const upsertColorStyles = async (data) => {
	const accessToken = document.getElementById("access-token").value
	const email = document.getElementById("email").value
	const author = document.getElementById("author").value
	const commitMsg = document.getElementById("commit-msg").value
	const projectId = document.getElementById("project-id").value
	const filename = document.getElementById("filename").value
	const branchName = document.getElementById("branch-name").value
	const targetBranch = document.getElementById("target-branch").value
	const fileExtension = document.getElementById("file-extension").value

	const createBranchRaw = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/branches`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"PRIVATE-TOKEN": accessToken,
		},
		body: JSON.stringify({
			branch: branchName,
			ref: targetBranch
		})
	})
	const createBranchParsed = await createBranchRaw.json()
	console.log(createBranchParsed)

	
	if (createBranchRaw.status === 400 && createBranchParsed.message === "Branch already exists") {
		// TODO: Send alert
	} else if (createBranchRaw.status !== 200) {
		// TODO: Send alert
	}

	const requestRaw = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/files/${filename}%2E${fileExtension}?ref=${branchName}`, {
		method: "GET",
		headers: {
			"PRIVATE-TOKEN": accessToken,
		},
	})
	const requestParsed = await requestRaw.json()
	if (requestParsed.message === "404 File Not Found") {
		const createFileRequestRaw = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/files/${filename}%2E${fileExtension}`, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			"PRIVATE-TOKEN": accessToken,
			},
			body: JSON.stringify({
				branch: branchName, 
				author_email: email,
				author_name: author,
				content: data,
				commit_message: commitMsg
			})
		})
		const createFileRequestParsed = await createFileRequestRaw.json()
		console.log(createFileRequestParsed)
	} else if (requestRaw.status === 200) {
		const updateFileRequestRaw = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/files/${filename}%2E${fileExtension}`, {
			method: "PUT",
			headers: {
			"Content-Type": "application/json",
			"PRIVATE-TOKEN": accessToken,
			},
			body: JSON.stringify({
				branch: branchName, 
				author_email: email,
				author_name: author,
				content: data,
				commit_message: commitMsg
			})
		})
		const updateFileRequestParsed = await updateFileRequestRaw.json()
		console.log(updateFileRequestParsed)
	}

	// Open MR for that branch
	const openMergeRequestRaw = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"PRIVATE-TOKEN": accessToken,
		},
		body: JSON.stringify({
			source_branch: branchName,
			target_branch: targetBranch,
			title: branchName,
		})
	})
	const openMergeRequestParsed = await openMergeRequestRaw.json()

	console.log(openMergeRequestParsed)
}


onmessage = (event) => {
	if (event.data.pluginMessage.type === "create-merge-request-response") {
		upsertColorStyles(event.data.pluginMessage.data);
	}

	if (event.data.pluginMessage.code) {
		document.getElementById("code").value = event.data.pluginMessage.code;
	}
	if (event.data.pluginMessage.downloadableCode) {
		// TODO: Instead of updating the link everytime we get a message, we should only update it when the user presses the download button
		const downloadLink = document.getElementById("download-link");
		const file = new Blob([event.data.pluginMessage.downloadableCode], {type: "text/plain"});
		downloadLink.href = URL.createObjectURL(file);
		downloadLink.download = 'styles.tsx';
	}
};

document.querySelectorAll("input[type=checkbox]").forEach((el) => {
	el.addEventListener("click", () => {
		parent.postMessage({ pluginMessage: { type: "style", id: el.id } }, "*");
	});
});

document.querySelectorAll("input[type=radio]:not([name='format'])").forEach((el) => {
	el.addEventListener("click", () => {
		if (el.checked) {
			parent.postMessage(
				{ pluginMessage: { type: "paint-option", id: el.id } },
				"*"
			);
		}
	});
});

document.querySelectorAll('input[name="format"]').forEach((input) => {
	input.addEventListener("change", () => {
		if (input.id === "settings") {
			document.getElementById("main-panel").style.display = "none";
			document.getElementById("actions").style.display = "none";
			document.getElementById("settings-panel").style.display = "flex";
		} else {
			document.getElementById("main-panel").style.display = "flex";
			document.getElementById("actions").style.display = "flex";
			document.getElementById("settings-panel").style.display = "none";
			parent.postMessage(
				{ pluginMessage: { type: "mode", change: input.value } },
				"*"
			);
			const effectInputEl = document.getElementById("effect");
			if (input.value === 'react-native') {
				if (effectInputEl.checked) {
					parent.postMessage({ pluginMessage: { type: "style", id: "effect" } }, "*");
					effectInputEl.checked = false
				}
				effectInputEl.disabled = true
			} else {
				effectInputEl.disabled = false
			}
		}
	});
});

document.getElementById("copy").onclick = () => {
	copyTextToClipboard();
};

document.getElementById("create-merge-request").onclick = async () => {
	parent.postMessage({ pluginMessage: { type: "create-merge-request-request" } }, "*");
};

function copyTextToClipboard() {
	const text = document.getElementById("code").value;
	const textArea = document.createElement("textarea");
	const toast = document.getElementById("toast");

	textArea.value = text;

	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);

	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand("copy");
		const msg = successful
			? "successfully copied! d(=^･ω･^=)b"
			: "error occured (=ＴェＴ=) ";

		toast.style.opacity = 1;
		toast.innerHTML = msg;
		setTimeout(() => {
			toast.style.opacity = 0;
		}, 1000);
	} catch (err) {
		toast.style.opacity = 1;
		toast.innerHTML = "error occured (=ＴェＴ=) ";

		console.error(err);
	}
	document.body.removeChild(textArea);
}
