#!/usr/local/bin/python
import csv
import json
import os

jsonfile = open('../../app/data/data.json', 'w')
csvfile = open('data.csv', 'rb')

fieldnames = [
    "dec",
    "hd_name",
    "hip_name",
    "pl_astflag",
    "pl_cbflag",
    "pl_dens",
    "pl_disc",
    "pl_discmethod",
    "pl_eqt",
    "pl_facility",
    "pl_hostname",
    "pl_imgflag",
    "pl_masse",
    "pl_massj",
    "pl_name",
    "pl_omflag",
    "pl_orbeccen",
    "pl_orbper",
    "pl_pnum",
    "pl_rade",
    "pl_radj",
    "pl_ratdor",
    "pl_rvflag",
    "pl_telescope",
    "pl_tranflag",
    "ra",
    "rowupdate",
    "st_age",
    "st_dist",
    "st_mass",
    "st_optmag",
    "st_rad",
    "st_teff",
    "pl_pelink",
    "pl_edelink"
]
reader = csv.DictReader(csvfile, fieldnames)

output = "["

for row in reader:
    if reader.line_num == 1:
        continue
    output = output + json.dumps(row) + ","

output = output[0:-1]
output = output + "]"

all_data = json.loads(output)

print len(all_data) + " planets in the catalog"

keys_to_delete = []

# kill empty data
for row in all_data:
    line = all_data.index(row)
    for key in row:
        if not row[key]:
            keys_to_delete.append({"row": line, "key": key})

for i in keys_to_delete:
    obj = all_data[i["row"]]
    obj.pop(i["key"], None)

out = json.dumps(all_data, separators=(',',':'))

jsonfile.write(out)