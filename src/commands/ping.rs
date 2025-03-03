use serenity::framework::standard::macros::command;
use serenity::framework::standard::CommandResult;
use serenity::model::channel::Message;
use serenity::prelude::*;
use std::time::Instant;

#[command]
pub async fn ping(ctx: &Context, msg: &Message) -> CommandResult {
    let start = Instant::now();
    let mut ping_msg = msg.channel_id.say(&ctx.http, "Testing latency...").await?;
    let ping = start.elapsed().as_millis();
    
    ping_msg.edit(ctx, |m| {
        m.content(format!("`{} ms`", ping))
    }).await?;

    Ok(())
}



