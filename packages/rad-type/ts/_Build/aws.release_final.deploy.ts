import * as ChildProcess from "child_process";

const run = (cmd: string) => {
  const buffer = ChildProcess.execSync(cmd).toString();
  // eslint-disable-next-line no-console
  console.log(buffer);
};

try {
  run(
    `aws s3 sync --sse --delete ./target/webpack/release_final s3://www.devev.com`,
  );
  run(
    `aws cloudfront create-invalidation --distribution-id E13DUGSA74E8XS --paths "/*"`,
  );
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
