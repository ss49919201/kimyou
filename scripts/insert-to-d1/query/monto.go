package query

import sqlbuilder "github.com/huandu/go-sqlbuilder"

func CreateManyMontos() (string, []any) {
	ib := sqlbuilder.NewInsertBuilder()
	ib.InsertInto("demo.user")
	ib.Cols("id", "name", "status", "created_at", "updated_at")
	ib.Values(1, "Huan Du", 1, sqlbuilder.Raw("UNIX_TIMESTAMP(NOW())"))
	ib.Values(2, "Charmy Liu", 1, 1234567890)

	return ib.Build()
}
