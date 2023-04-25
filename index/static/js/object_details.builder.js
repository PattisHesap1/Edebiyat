let TEMPLATE_COMMENT
const comments_list = document.getElementById("comments")
let comment = {
	is_anonymous: false,
	is_spoilers: false,
	content: "",
	parent_id: null,
	author: "",
}
function main() {
	// document.addEventListener("scroll",(e)=>{
	// 	console.log(window.scrollY)
	// })
	const comment_page = document.getElementById("comments_page")
	comment_page.addEventListener("bl-change", (e) => {
		comment_page_changed(comment_page)
	})
	const comments_request = new XMLHttpRequest()
	comments_request.open("GET", "/api/v1/literature_objects/" + "1" + "/comments/list?max-results=50&cursor=" + 0)
	comments_request.send()
	comments_request.onload = (e) => {
		if (comments_request.status == 200 && comments_request.responseText) {
			const data = JSON.parse(comments_request.responseText)
			data.forEach((comment) => {
				new Comment(comment)
			})
		}
	}
	
	const comments_post = document.getElementById("comments_post")
	const is_spoilers_element = document.getElementById("is_contains_spoilers")
	const author_name_element = document.getElementById("comments_post_username")
	const is_anonymous_element = document.getElementById("is_anonymous")
	const comment_content_element = document.getElementById("comments_post_content")
	const comment_post_button = document.getElementById("comments_post_send")
	comment_post_button.addEventListener("bl-click", (e) => {
		const request = new XMLHttpRequest()
		request.open("POST", "/api/v1/literature_objects/" + "1" + "/comments/post")
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		request.setRequestHeader("is-hide-name", comment["is_anonymous"])
		request.setRequestHeader("is-spoilers", comment["is_spoilers"])
		request.setRequestHeader("author-name", comment["author"])
		request.setRequestHeader("content", comment["content"])
		request.send()
		request.onload = (e) => {
			if (request.responseText) {
				const data = JSON.parse(request.responseText)
				if (data.success) {
					new Comment(data)
				} else {
					const error_message = Translated(data.error)
					const error = data.error
					console.log(error, ":", error_message)
					const new_alert = document.createElement("bl-alert")
					new_alert.setAttribute("variant", "danger")
					new_alert.setAttribute("caption", Translated("error")+": " + error)
					new_alert.innerText = error_message
					const button = document.createElement("bl-button")
					button.setAttribute("slot", "action-secondary")
					button.innerText = Translated("ok")
					new_alert.appendChild(button)
					button.addEventListener("bl-click", (e) => {
						new_alert.close()
					})
					comments_post.appendChild(new_alert)
				}
			}
		}
	})
	is_spoilers_element.addEventListener("bl-switch-toggle", (e) => {
		comment["is_spoilers"] = e.detail
	})
	author_name_element.addEventListener("bl-input", (e) => {
		console.log(comment)
		comment["author"] = comment_content_element.getAttribute("value")
	})
	comment_content_element.addEventListener("bl-input", (e) => {
		comment["content"] = comment_content_element.getAttribute("value")
	})
	is_anonymous_element.addEventListener("bl-switch-toggle", (e) => {
		comment["is_anonymous"] = e.detail
	})
}
function comment_page_changed(object) {
	console.log(object.getAttribute("current-page"), object.getAttribute("items-per-page"))
}
class Comment {
	constructor(comment_data) {
		const new_comment = document.createElement("div")
		new_comment.className = "comment"
		new_comment.innerHTML = TEMPLATE_COMMENT
		const field_creator = new_comment.getElementsByClassName("comment-creator")[0]
		const field_message_content = new_comment.getElementsByClassName("comment-content")[0]
		const field_message_created_at = new_comment.getElementsByClassName("comment-created-at")[0]
		const field_message_upvotes = new_comment.getElementsByClassName("comment-upvotes")[0]
		const field_message_downvotes = new_comment.getElementsByClassName("comment-downvotes")[0]
		new_comment.id = comment_data.id
		field_message_content.innerText = comment_data.content
		field_message_upvotes.innerText = comment_data.votes.up
		field_message_downvotes.innerText = comment_data.votes.down
		field_creator.innerText = comment_data.hide_name ? "anonim (" + comment_data.author.uid + ")" : comment_data.author.name + " (" + comment_data.author.uid + ")"
		if (comment_data.hide_name) {
			field_creator.style.fontStyle = "italic"
		}
		field_message_downvotes.addEventListener("click", () => {
			console.log("downvote")
		})
		const created_at = new Date(comment_data.created_at)
		field_message_created_at.innerText = created_at.toLocaleString()
		comments_list.appendChild(new_comment)
	}
}
const comment_template_promise = new Promise((resolve, reject) => {
	const request = new XMLHttpRequest()
	request.open("GET", "/static/html/templates/comment.html")
	request.send()
	request.onload = (e) => {
		if (request.status == 200 && request.responseText) {
			TEMPLATE_COMMENT = request.responseText
			resolve()
		}
	}
})
comment_template_promise.then((e) => {
	main()
})
