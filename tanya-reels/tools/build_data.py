"""Build tanya.json from Sefaria's export of the Kehot English Tanya (CC-BY-NC).

Source: https://storage.googleapis.com/sefaria-export/json/Chasidut/Chabad/Tanya/English/Kehot%20Publication%20Society%20English%20Translation.json
Usage:  python3 build_data.py kehot.json ../tanya.json

Each chapter becomes a list of "units": sentence groups small enough to pack into reels.
Nothing is dropped: the script checks that every word and every footnote survives.
"""
import json, re, sys

MARK = '<sup class="footnote-marker">'
FOOT = '<i class="footnote">'
UNIT_MAX = 45  # words per unit before it is split at a sentence end

def take_balanced_i(s, start):
    """s[start:] begins just after an opening <i ...>; return index after its matching </i>."""
    depth, i = 1, start
    while depth:
        o, c = s.find('<i', i), s.find('</i>', i)
        if o != -1 and o < c:
            depth += 1; i = o + 2
        else:
            depth -= 1; i = c + 4
    return i

def pull_notes(s):
    notes, out, i = [], [], 0
    while True:
        j = s.find(MARK, i)
        if j < 0:
            out.append(s[i:]); break
        out.append(s[i:j])
        k = s.find('</sup>', j)
        mk = s[j + len(MARK):k]
        k += len('</sup>')
        if s.startswith(FOOT, k):
            e = take_balanced_i(s, k + len(FOOT))
            notes.append([mk, s[k + len(FOOT):e - 4].strip()])
            k = e
        out.append('<sup>%s</sup>' % mk)
        i = k
    return ''.join(out), notes

def clean(h):
    h = h.replace('<small>', '<span class="gloss">').replace('</small>', '</span>')
    h = re.sub(r'<(?!/?(i|b|sup|span|br)\b)[^>]+>', '', h)
    return h

plain = lambda h: re.sub(r'<[^>]+>', ' ', h)
wc = lambda h: len(plain(h).split())

def split_units(html):
    """Split one segment into units at <br> and sentence ends, outside footnote markers.
    Returns [(unit_html, starts_paragraph)]; open <i>/<span> tags are closed and reopened."""
    toks = re.findall(r'<[^>]+>|[^<]+', html)
    units, cur, stack, words, para = [], '', [], 0, 1

    def cut(new_para):
        nonlocal cur, words, para
        if plain(cur).strip():
            closing = ''.join('</%s>' % re.match(r'<(\w+)', x).group(1) for x in reversed(stack))
            units.append((cur + closing, para)); cur = ''.join(stack); words = 0; para = new_para
        else:
            para = para or new_para

    for t in toks:
        if t.startswith('<br'):
            cut(1); continue
        if t.startswith('<'):
            cur += t
            if t.startswith('</'):
                if stack: stack.pop()
            else: stack.append(t)
            continue
        pos = 0
        for m in re.finditer(r'[.!?;][”’"\)\]]*\s+', t):
            seg = t[pos:m.end()]
            cur += seg; words += len(seg.split()); pos = m.end()
            limit = UNIT_MAX * 0.5 if not stack else UNIT_MAX
            if words >= limit and not any(x.startswith('<sup') for x in stack):
                cut(0)
        cur += t[pos:]; words += len(t[pos:].split())
    if plain(cur).strip(): units.append((cur, para))
    elif units: units[-1] = (units[-1][0] + cur, units[-1][1])
    return units

def build_chapter(segs):
    units, notes = [], []
    for seg in segs:
        body, n = pull_notes(seg)
        notes += n
        for i, (u, par) in enumerate(split_units(clean(body).strip())):
            u = re.sub(r'<(i|span|b)[^>]*>\s*</\1>', '', u).strip()
            units.append({'h': u, 'w': wc(u), 'p': 1 if (i == 0 or par) else 0})
    return units, notes

def main(src, dst):
    d = json.load(open(src))
    p = d['text']['Part I; Likkutei Amarim']
    chapters = []
    sections = [("Compiler's Foreword", p["Compiler's Foreword"])] + \
               [('Chapter %d' % (i + 1), c) for i, c in enumerate(p[''])]
    total_in = total_out = 0
    for title, segs in sections:
        units, notes = build_chapter(segs)
        # verification: words in == words out, notes in == notes out
        src_text = plain(' '.join(clean(pull_notes(s)[0]) for s in segs)).split()
        out_text = plain(' '.join(u['h'] for u in units)).split()
        assert src_text == out_text, (title, 'text changed')
        src_words, out_words = len(src_text), sum(u['w'] for u in units)
        src_notes = sum(s.count(MARK) for s in segs)
        assert src_words == out_words, (title, src_words, out_words)
        assert src_notes == len(notes), (title, src_notes, len(notes))
        total_in += src_words; total_out += out_words
        chapters.append({'t': title, 'u': units, 'n': notes})
    json.dump({'source': {'title': d['versionTitle'], 'license': d['license'], 'notes': d['versionNotes'],
                          'url': 'https://www.sefaria.org/Tanya,_Part_I;_Likkutei_Amarim'},
               'chapters': chapters}, open(dst, 'w'), ensure_ascii=False, separators=(',', ':'))
    print('ok', len(chapters), 'sections,', total_out, 'words, all kept')

main(*sys.argv[1:3])
