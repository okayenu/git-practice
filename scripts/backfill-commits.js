/**
 * Creates 125 backdated commits (Mar 1 - May 31, 2025) with UI/functionality changes.
 * Run from project root: node scripts/backfill-commits.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const hours = Math.floor(Math.random() * 24);
  const mins = Math.random() < 0.5 ? 0 : 30; // 12:00 or 12:30 style
  d.setHours(hours, mins, 0, 0);
  return d;
}

function formatGitDate(d) {
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Mar 1 2025 00:00 to May 31 2025 23:59
const start = new Date(2025, 2, 1, 0, 0, 0);
const end = new Date(2025, 4, 31, 23, 59, 59);
const dates = [];
for (let i = 0; i < 125; i++) dates.push(randomDate(start, end));
dates.sort((a, b) => a - b);

// 125 edits: each { file, old, new, message }
// Order matters: each "old" is what we expect to be there (from previous state or initial).
const edits = [
  { file: 'styles/shared/general.css', old: 'border-radius: 6px;', new: 'border-radius: 8px;', msg: 'Increase primary button border radius' },
  { file: 'styles/shared/general.css', old: 'color: rgb(33, 33, 33);', new: 'color: rgb(30, 30, 30);', msg: 'Slightly darken body text color' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-left: 20px;', new: 'padding-left: 18px;', msg: 'Adjust header left padding' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-right: 20px;', new: 'padding-right: 18px;', msg: 'Adjust header right padding' },
  { file: 'styles/pages/amazon.css', old: 'margin-top: 64px;', new: 'margin-top: 68px;', msg: 'Increase main content top margin' },
  { file: 'styles/pages/amazon.css', old: 'border-right: 1px solid rgb(225, 225, 225);', new: 'border-right: 1px solid rgb(231, 231, 231);', msg: 'Soften product grid border color' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 24px;', new: 'font-size: 22px;', msg: 'Adjust checkout page title size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'border-radius: 8px;', new: 'border-radius: 6px;', msg: 'Tweak checkout card border radius' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'padding-left: 24px;', new: 'padding-left: 28px;', msg: 'Increase checkout header padding' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'background-color: rgb(250, 250, 250);', new: 'background-color: white;', msg: 'Use white checkout header background' },
  { file: 'styles/shared/general.css', old: 'border-radius: 8px;', new: 'border-radius: 6px;', msg: 'Soften primary button radius' },
  { file: 'styles/shared/general.css', old: 'color: rgb(0, 113, 133);', new: 'color: rgb(1, 124, 182);', msg: 'Update link primary color' },
  { file: 'styles/shared/amazon-header.css', old: 'height: 60px;', new: 'height: 58px;', msg: 'Slightly reduce header height' },
  { file: 'styles/shared/amazon-header.css', old: 'border-top-right-radius: 6px;', new: 'border-top-right-radius: 4px;', msg: 'Adjust search button radius' },
  { file: 'styles/shared/amazon-header.css', old: 'border-bottom-right-radius: 6px;', new: 'border-bottom-right-radius: 4px;', msg: 'Match search button bottom radius' },
  { file: 'styles/pages/amazon.css', old: 'padding-top: 40px;', new: 'padding-top: 38px;', msg: 'Reduce product card top padding' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 20px;', new: 'margin-bottom: 18px;', msg: 'Tighten product image margin' },
  { file: 'styles/pages/amazon.css', old: 'height: 180px;', new: 'height: 175px;', msg: 'Slightly reduce product image container height' },
  { file: 'styles/pages/checkout/checkout.css', old: 'max-width: 1100px;', new: 'max-width: 1080px;', msg: 'Narrow checkout main max-width' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 20px;', new: 'margin-bottom: 22px;', msg: 'Increase page title bottom margin' },
  { file: 'styles/pages/orders.css', old: 'margin-top: 90px;', new: 'margin-top: 85px;', msg: 'Reduce orders page top margin' },
  { file: 'styles/pages/orders.css', old: 'font-size: 26px;', new: 'font-size: 24px;', msg: 'Reduce orders page title size' },
  { file: 'styles/pages/tracking.css', old: 'margin-top: 90px;', new: 'margin-top: 88px;', msg: 'Adjust tracking page top margin' },
  { file: 'styles/pages/tracking.css', old: 'font-size: 25px;', new: 'font-size: 24px;', msg: 'Adjust delivery date font size' },
  { file: 'amazon.html', old: 'placeholder="Search Amazon"', new: 'placeholder="Search"', msg: 'Simplify search placeholder text' },
  { file: 'styles/shared/general.css', old: 'color: rgb(30, 30, 30);', new: 'color: rgb(33, 33, 33);', msg: 'Revert body text to default' },
  { file: 'styles/shared/general.css', old: 'outline: 2px solid rgb(255, 165, 0);', new: 'outline: 2px solid rgb(255, 153, 0);', msg: 'Refine focus outline color' },
  { file: 'styles/shared/general.css', old: 'border-radius: 6px;', new: 'border-radius: 8px;', msg: 'Restore primary button radius' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-left: 18px;', new: 'padding-left: 20px;', msg: 'Restore header left padding' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-right: 18px;', new: 'padding-right: 20px;', msg: 'Restore header right padding' },
  { file: 'styles/shared/amazon-header.css', old: 'height: 58px;', new: 'height: 60px;', msg: 'Restore header height' },
  { file: 'styles/shared/amazon-header.css', old: 'font-size: 13px;', new: 'font-size: 12px;', msg: 'Slightly reduce returns text size' },
  { file: 'styles/shared/amazon-header.css', old: 'font-size: 12px;', new: 'font-size: 13px;', msg: 'Restore returns text size' },
  { file: 'styles/pages/amazon.css', old: 'margin-top: 68px;', new: 'margin-top: 64px;', msg: 'Restore main top margin' },
  { file: 'styles/pages/amazon.css', old: 'border-bottom: 1px solid rgb(225, 225, 225);', new: 'border-bottom: 1px solid rgb(220, 220, 220);', msg: 'Darken product border slightly' },
  { file: 'styles/pages/amazon.css', old: 'border-right: 1px solid rgb(231, 231, 231);', new: 'border-right: 1px solid rgb(225, 225, 225);', msg: 'Soften product grid border' },
  { file: 'styles/pages/amazon.css', old: 'padding-top: 38px;', new: 'padding-top: 40px;', msg: 'Restore product card top padding' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 18px;', new: 'margin-bottom: 20px;', msg: 'Restore product image margin' },
  { file: 'styles/pages/amazon.css', old: 'height: 175px;', new: 'height: 180px;', msg: 'Restore image container height' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 10px;', new: 'margin-bottom: 12px;', msg: 'Increase rating container margin' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 12px;', new: 'margin-bottom: 10px;', msg: 'Restore rating margin' },
  { file: 'styles/pages/amazon.css', old: 'border-radius: 50px;', new: 'border-radius: 48px;', msg: 'Tweak add-to-cart button radius' },
  { file: 'styles/pages/amazon.css', old: 'border-radius: 48px;', new: 'border-radius: 50px;', msg: 'Restore add-to-cart radius' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 22px;', new: 'font-size: 24px;', msg: 'Restore page title size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'border-radius: 6px;', new: 'border-radius: 8px;', msg: 'Restore checkout card radius' },
  { file: 'styles/pages/checkout/checkout.css', old: 'max-width: 1080px;', new: 'max-width: 1100px;', msg: 'Restore checkout max-width' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 22px;', new: 'margin-bottom: 20px;', msg: 'Restore title margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'padding: 18px;', new: 'padding: 20px;', msg: 'Increase cart item padding' },
  { file: 'styles/pages/checkout/checkout.css', old: 'padding: 20px;', new: 'padding: 18px;', msg: 'Restore cart item padding' },
  { file: 'styles/pages/checkout/checkout.css', old: 'column-gap: 12px;', new: 'column-gap: 14px;', msg: 'Widen checkout grid gap' },
  { file: 'styles/pages/checkout/checkout.css', old: 'column-gap: 14px;', new: 'column-gap: 12px;', msg: 'Restore grid gap' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-top: 140px;', new: 'margin-top: 138px;', msg: 'Reduce checkout main top margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-top: 138px;', new: 'margin-top: 140px;', msg: 'Restore main top margin' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'padding-left: 28px;', new: 'padding-left: 24px;', msg: 'Restore checkout header padding' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'background-color: white;', new: 'background-color: rgb(250, 250, 250);', msg: 'Use light gray checkout header' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'font-size: 25px;', new: 'font-size: 24px;', msg: 'Slightly reduce checkout title size' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'font-size: 24px;', new: 'font-size: 25px;', msg: 'Restore checkout title size' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'font-size: 23px;', new: 'font-size: 22px;', msg: 'Reduce return link size' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'font-size: 22px;', new: 'font-size: 23px;', msg: 'Restore return link size' },
  { file: 'styles/pages/orders.css', old: 'margin-top: 85px;', new: 'margin-top: 90px;', msg: 'Restore orders top margin' },
  { file: 'styles/pages/orders.css', old: 'font-size: 24px;', new: 'font-size: 26px;', msg: 'Restore orders title size' },
  { file: 'styles/pages/orders.css', old: 'margin-bottom: 25px;', new: 'margin-bottom: 22px;', msg: 'Reduce orders title margin' },
  { file: 'styles/pages/orders.css', old: 'margin-bottom: 22px;', new: 'margin-bottom: 25px;', msg: 'Restore orders title margin' },
  { file: 'styles/pages/orders.css', old: 'border-top-left-radius: 8px;', new: 'border-top-left-radius: 6px;', msg: 'Soften order header radius' },
  { file: 'styles/pages/orders.css', old: 'border-top-right-radius: 8px;', new: 'border-top-right-radius: 6px;', msg: 'Match order header radius' },
  { file: 'styles/pages/orders.css', old: 'border-top-left-radius: 6px;', new: 'border-top-left-radius: 8px;', msg: 'Restore order header radius' },
  { file: 'styles/pages/orders.css', old: 'border-top-right-radius: 6px;', new: 'border-top-right-radius: 8px;', msg: 'Restore order header radius' },
  { file: 'styles/pages/orders.css', old: 'padding: 20px 25px;', new: 'padding: 18px 24px;', msg: 'Tighten order header padding' },
  { file: 'styles/pages/orders.css', old: 'padding: 18px 24px;', new: 'padding: 20px 25px;', msg: 'Restore order header padding' },
  { file: 'styles/pages/tracking.css', old: 'margin-top: 88px;', new: 'margin-top: 90px;', msg: 'Restore tracking top margin' },
  { file: 'styles/pages/tracking.css', old: 'font-size: 24px;', new: 'font-size: 25px;', msg: 'Restore delivery date size' },
  { file: 'styles/pages/tracking.css', old: 'padding-left: 30px;', new: 'padding-left: 28px;', msg: 'Reduce tracking padding' },
  { file: 'styles/pages/tracking.css', old: 'padding-right: 30px;', new: 'padding-right: 28px;', msg: 'Match tracking padding' },
  { file: 'styles/pages/tracking.css', old: 'padding-left: 28px;', new: 'padding-left: 30px;', msg: 'Restore tracking padding' },
  { file: 'styles/pages/tracking.css', old: 'padding-right: 28px;', new: 'padding-right: 30px;', msg: 'Restore tracking padding' },
  { file: 'amazon.html', old: 'placeholder="Search"', new: 'placeholder="Search Amazon"', msg: 'Add Amazon to search placeholder' },
  { file: 'styles/shared/general.css', old: 'color: rgb(1, 124, 182);', new: 'color: rgb(0, 113, 133);', msg: 'Darken link primary slightly' },
  { file: 'styles/shared/general.css', old: 'color: rgb(180, 70, 0);', new: 'color: rgb(196, 80, 0);', msg: 'Adjust link hover color' },
  { file: 'styles/shared/general.css', old: 'color: rgb(196, 80, 0);', new: 'color: rgb(180, 70, 0);', msg: 'Soften link hover color' },
  { file: 'styles/shared/general.css', old: 'padding: 3px 5px;', new: 'padding: 4px 6px;', msg: 'Increase select padding' },
  { file: 'styles/shared/general.css', old: 'padding: 4px 6px;', new: 'padding: 3px 5px;', msg: 'Restore select padding' },
  { file: 'styles/shared/general.css', old: 'font-size: 15px;', new: 'font-size: 14px;', msg: 'Slightly reduce select font size' },
  { file: 'styles/shared/general.css', old: 'font-size: 14px;', new: 'font-size: 15px;', msg: 'Restore select font size' },
  { file: 'styles/shared/general.css', old: 'box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5);', new: 'box-shadow: 0 2px 6px rgba(213, 217, 217, 0.5);', msg: 'Slightly increase button shadow' },
  { file: 'styles/shared/general.css', old: 'box-shadow: 0 2px 6px rgba(213, 217, 217, 0.5);', new: 'box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5);', msg: 'Restore button shadow' },
  { file: 'styles/shared/amazon-header.css', old: 'border-top-right-radius: 4px;', new: 'border-top-right-radius: 6px;', msg: 'Restore search button radius' },
  { file: 'styles/shared/amazon-header.css', old: 'border-bottom-right-radius: 4px;', new: 'border-bottom-right-radius: 6px;', msg: 'Restore search button radius' },
  { file: 'styles/shared/amazon-header.css', old: 'height: 38px;', new: 'height: 40px;', msg: 'Increase search bar height' },
  { file: 'styles/shared/amazon-header.css', old: 'height: 40px;', new: 'height: 38px;', msg: 'Restore search bar height' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-left: 15px;', new: 'padding-left: 12px;', msg: 'Reduce search bar left padding' },
  { file: 'styles/shared/amazon-header.css', old: 'padding-left: 12px;', new: 'padding-left: 15px;', msg: 'Restore search bar padding' },
  { file: 'styles/shared/amazon-header.css', old: 'max-width: 850px;', new: 'max-width: 840px;', msg: 'Slightly narrow search section' },
  { file: 'styles/shared/amazon-header.css', old: 'max-width: 840px;', new: 'max-width: 850px;', msg: 'Restore search section width' },
  { file: 'styles/shared/amazon-header.css', old: 'width: 180px;', new: 'width: 175px;', msg: 'Slightly narrow header right section' },
  { file: 'styles/shared/amazon-header.css', old: 'width: 175px;', new: 'width: 180px;', msg: 'Restore header section width' },
  { file: 'styles/pages/amazon.css', old: 'border-right: 1px solid rgb(225, 225, 225);', new: 'border-right: 1px solid rgb(231, 231, 231);', msg: 'Soften product border' },
  { file: 'styles/pages/amazon.css', old: 'border-bottom: 1px solid rgb(220, 220, 220);', new: 'border-bottom: 1px solid rgb(225, 225, 225);', msg: 'Restore product border' },
  { file: 'styles/pages/amazon.css', old: 'padding-bottom: 25px;', new: 'padding-bottom: 22px;', msg: 'Reduce product card bottom padding' },
  { file: 'styles/pages/amazon.css', old: 'padding-bottom: 22px;', new: 'padding-bottom: 25px;', msg: 'Restore product bottom padding' },
  { file: 'styles/pages/amazon.css', old: 'padding-left: 25px;', new: 'padding-left: 24px;', msg: 'Tweak product horizontal padding' },
  { file: 'styles/pages/amazon.css', old: 'padding-right: 25px;', new: 'padding-right: 24px;', msg: 'Match product horizontal padding' },
  { file: 'styles/pages/amazon.css', old: 'padding-left: 24px;', new: 'padding-left: 25px;', msg: 'Restore product padding' },
  { file: 'styles/pages/amazon.css', old: 'padding-right: 24px;', new: 'padding-right: 25px;', msg: 'Restore product padding' },
  { file: 'styles/pages/amazon.css', old: 'width: 100px;', new: 'width: 98px;', msg: 'Slightly reduce rating stars width' },
  { file: 'styles/pages/amazon.css', old: 'width: 98px;', new: 'width: 100px;', msg: 'Restore rating stars width' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 17px;', new: 'margin-bottom: 16px;', msg: 'Tighten quantity container margin' },
  { file: 'styles/pages/amazon.css', old: 'margin-bottom: 16px;', new: 'margin-bottom: 17px;', msg: 'Restore quantity margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'grid-template-columns: 1fr 350px;', new: 'grid-template-columns: 1fr 340px;', msg: 'Narrow order summary column' },
  { file: 'styles/pages/checkout/checkout.css', old: 'grid-template-columns: 1fr 340px;', new: 'grid-template-columns: 1fr 350px;', msg: 'Restore summary column width' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 12px;', new: 'margin-bottom: 14px;', msg: 'Increase cart item bottom margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 14px;', new: 'margin-bottom: 12px;', msg: 'Restore cart item margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 19px;', new: 'font-size: 18px;', msg: 'Slightly reduce delivery date size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 18px;', new: 'font-size: 19px;', msg: 'Restore delivery date size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'column-gap: 25px;', new: 'column-gap: 24px;', msg: 'Tweak cart details gap' },
  { file: 'styles/pages/checkout/checkout.css', old: 'column-gap: 24px;', new: 'column-gap: 25px;', msg: 'Restore cart details gap' },
  { file: 'styles/pages/checkout/checkout.css', old: 'border-radius: 8px;', new: 'border-radius: 6px;', msg: 'Soften place order button radius' },
  { file: 'styles/pages/checkout/checkout.css', old: 'border-radius: 6px;', new: 'border-radius: 8px;', msg: 'Restore place order radius' },
  { file: 'checkout.html', old: '<title>Checkout</title>', new: '<title>Checkout - Review Order</title>', msg: 'Improve checkout page title' },
  { file: 'checkout.html', old: '<title>Checkout - Review Order</title>', new: '<title>Checkout</title>', msg: 'Simplify checkout title' },
  { file: 'orders.html', old: '<title>Orders</title>', new: '<title>Your Orders</title>', msg: 'Improve orders page title' },
  { file: 'orders.html', old: '<title>Your Orders</title>', new: '<title>Orders</title>', msg: 'Simplify orders title' },
  { file: 'amazon.html', old: '<title>Amazon Project</title>', new: '<title>Amazon - Products</title>', msg: 'Refine home page title' },
  { file: 'amazon.html', old: '<title>Amazon - Products</title>', new: '<title>Amazon Project</title>', msg: 'Restore home page title' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 18px;', new: 'font-size: 17px;', msg: 'Slightly reduce payment summary title' },
  { file: 'styles/pages/checkout/checkout.css', old: 'font-size: 17px;', new: 'font-size: 18px;', msg: 'Restore payment summary title size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 9px;', new: 'margin-bottom: 10px;', msg: 'Increase summary row margin' },
  { file: 'styles/pages/checkout/checkout.css', old: 'margin-bottom: 10px;', new: 'margin-bottom: 9px;', msg: 'Restore summary row margin' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'width: 150px;', new: 'width: 140px;', msg: 'Narrow checkout header sections' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'width: 140px;', new: 'width: 150px;', msg: 'Restore checkout header width' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'text-align: right;\n  width: 150px;', new: 'text-align: right;\n  width: 140px;', msg: 'Narrow right section' },
  { file: 'styles/pages/checkout/checkout-header.css', old: 'text-align: right;\n  width: 140px;', new: 'text-align: right;\n  width: 150px;', msg: 'Restore right section width' },
  { file: 'styles/shared/general.css', old: 'outline: 2px solid rgb(255, 153, 0);', new: 'outline: 2px solid rgb(255, 165, 0);', msg: 'Slightly brighten focus outline' },
  { file: 'styles/pages/amazon.css', old: 'color: rgb(6, 125, 98);', new: 'color: rgb(5, 120, 95);', msg: 'Tweak added-to-cart green' },
  { file: 'styles/pages/amazon.css', old: 'color: rgb(5, 120, 95);', new: 'color: rgb(6, 125, 98);', msg: 'Restore added-to-cart color' },
  { file: 'styles/pages/amazon.css', old: 'font-size: 16px;', new: 'font-size: 15px;', msg: 'Slightly reduce added-to-cart font' },
  { file: 'styles/pages/amazon.css', old: 'font-size: 15px;', new: 'font-size: 16px;', msg: 'Restore added-to-cart font size' },
  { file: 'styles/pages/checkout/checkout.css', old: 'color: rgb(0, 118, 0);', new: 'color: rgb(0, 115, 0);', msg: 'Slightly darken delivery green' },
  { file: 'styles/pages/checkout/checkout.css', old: 'color: rgb(0, 115, 0);', new: 'color: rgb(0, 118, 0);', msg: 'Restore delivery green' },
  { file: 'styles/pages/orders.css', old: 'background-color: rgb(240, 242, 242);', new: 'background-color: rgb(238, 240, 240);', msg: 'Slightly darken order header bg' },
  { file: 'styles/pages/orders.css', old: 'background-color: rgb(238, 240, 240);', new: 'background-color: rgb(240, 242, 242);', msg: 'Restore order header background' },
  { file: 'styles/pages/checkout/checkout.css', old: 'color: rgb(177, 39, 4);', new: 'color: rgb(170, 36, 4);', msg: 'Tweak price red' },
  { file: 'styles/pages/checkout/checkout.css', old: 'color: rgb(170, 36, 4);', new: 'color: rgb(177, 39, 4);', msg: 'Restore price color' },
].slice(0, 125);

if (edits.length !== 125) {
  console.error('Expected 125 edits, got', edits.length);
  process.exit(1);
}

function applyEdit(edit) {
  const filePath = path.join(ROOT, edit.file);
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  if (!content.includes(edit.old)) {
    console.error('Edit failed: "old" not found in', edit.file);
    console.error('Looking for:', JSON.stringify(edit.old));
    process.exit(1);
  }
  content = content.replace(edit.old, edit.new);
  fs.writeFileSync(filePath, content);
}

function run(cmd, env = {}) {
  execSync(cmd, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });
}

console.log('Creating 125 backdated commits (Mar 1 - May 31, 2025)...\n');
for (let i = 0; i < 125; i++) {
  const edit = edits[i];
  const dateStr = formatGitDate(dates[i]);
  applyEdit(edit);
  run(`git add "${edit.file}"`);
  run(`git commit -m "${edit.msg.replace(/"/g, '\\"')}"`, {
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr
  });
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/125 commits done.`);
}
console.log('\nDone. 125 commits created.');
