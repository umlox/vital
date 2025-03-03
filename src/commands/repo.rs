use serenity::framework::standard::macros::command;
use serenity::framework::standard::CommandResult;
use serenity::model::channel::Message;
use serenity::prelude::*;
use reqwest;
use serde_json::Value;
use chrono::{DateTime, Utc};

#[command]
pub async fn repo(ctx: &Context, msg: &Message) -> CommandResult {
    let repo_name = "nxyystore/honest.rocks";
    let url = format!("https://api.github.com/repos/{}/commits", repo_name);
    
    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .header("User-Agent", "Discord-Bot")
        .send()
        .await?
        .json::<Vec<Value>>()
        .await?;

    if let Some(latest_commit) = response.first() {
        let sha = latest_commit["sha"].as_str().unwrap_or("unknown");
        let message = latest_commit["commit"]["message"].as_str().unwrap_or("no message");
        let date = latest_commit["commit"]["author"]["date"].as_str().unwrap_or("");
        
        let datetime = DateTime::parse_from_rfc3339(date)
            .unwrap_or_default()
            .with_timezone(&Utc);
            
        let files_changed = latest_commit["files"].as_array().map_or(0, |f| f.len());

        let response_text = format!(
            "Commit to {}\n\nThere has been 1 commit to {}\n\n! Modified {} file(s)\n\n{}\n\n{}\n\n{}",
            repo_name, repo_name, files_changed, &sha[..6], message, datetime.format("%Y-%m-%d %H:%M:%S")
        );

        msg.channel_id.say(&ctx.http, response_text).await?;
    }

    Ok(())
}
